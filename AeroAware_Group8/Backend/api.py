from flask import Flask, request, jsonify
from dtos.basefare import BaseFareDTO
from pydantic import ValidationError
from services.basefare_predictor import predict_basefare
from services.flight_metrics import calculate_multi_stop_flight_metrics
from config.mappings import airport_mapping, airline_mapping, day_of_week_mapping
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows all domains by default
# Root welcome route
@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the AERO AWARE API!",
        "endpoints": {
            "Get all airports": "/api/v1/airports",
            "Get specific airport": "/api/v1/airports/<airport_code>",
            "Get all weekdays": "/api/v1/days",
            "Get all airlines": "/api/v1/airlines",
            "Calculate multi-stop flight metrics": "/api/v1/calculate-multi-stop",
            "Predict base fare": "/api/v1/predict-basefare",
            "Evaluate if date is weekend or not": "/api/v1/is-weekend",
            "Evaluate if major airline or not": "/api/v1/is-major-airline",
        }
    })
    
# is major airline?
@app.route('/api/v1/is-major-airline', methods=['POST'])
def is_major_airline():
    data = request.get_json()
    airline_id = data.get('airlineId')

    if airline_id is None:
        return jsonify({"error": "Missing 'airlineId' field"}), 400

    try:
        airline_id = int(airline_id)
    except ValueError:
        return jsonify({"error": "'airlineId' must be an integer"}), 400

    is_major = 1 if airline_id in [2, 3, 4] else 0

    return jsonify({"isMajorAirline": is_major})

# GET all airport mappings
@app.route('/api/v1/airports', methods=['GET'])
def get_all_airports():
    return jsonify(airport_mapping)

# GET a specific airport code
@app.route('/api/v1/airports/<string:code>', methods=['GET'])
def get_airport(code):
    code = code.upper()
    if code in airport_mapping:
        return jsonify({code: airport_mapping[code]})
    return jsonify({"error": "Airport code not found"}), 404

# GET all airlines
@app.route('/api/v1/airlines', methods=['GET'])
def get_all_airlines():
    return jsonify(airline_mapping)

# GET all days of the week mapping
@app.route('/api/v1/days', methods=['GET'])
def get_all_days():
    return jsonify(day_of_week_mapping)

# POST: Calculate total distance & duration for multi-stop route
@app.route('/api/v1/calculate-multi-stop', methods=['POST'])
def get_multi_stop_metrics():
    data = request.json
    stops = data.get('stops')
    if not stops or not isinstance(stops, list):
        return jsonify({"error": "Missing or invalid stops list"}), 400

    result = calculate_multi_stop_flight_metrics(origin_code='DFW', stops_list=stops)
    return jsonify(result)

# POST: Predict base fare
@app.route('/api/v1/predict-basefare', methods=['POST'])
def predict_basefare_route():
    try:
        request_data = request.get_json()
        dto = BaseFareDTO(**request_data)  # Validate with pydantic DTO
        prediction = predict_basefare(dto.dict())
        return jsonify({"predicted_baseFare": prediction})
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
 # POST: return is weekend val
@app.route('/api/v1/is-weekend', methods=['POST'])
def is_weekend():
    data = request.get_json()
    datetime_str = data.get('datetime')

    if not datetime_str:
        return jsonify({"error": "Missing 'datetime' field"}), 400

    try:
        dt = datetime.fromisoformat(datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid datetime format. Use ISO format like 'YYYY-MM-DDTHH:MM'"}), 400

    is_weekend_flag = 1 if dt.weekday() >= 5 else 0

    return jsonify({"isWeekend": is_weekend_flag})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
