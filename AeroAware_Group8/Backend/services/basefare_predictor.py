import joblib
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, TimeoutError

# Load model
model = joblib.load("models/best_model6.pkl")

MODEL_FEATURES = [
    'destinationAirport', 'isBasicEconomy', 'totalTravelDistance', 'daysUntilFlight',
    'numStops', 'mainAirlineCode', 'travelDurationMinutes', 'searchDayOfWeek',
    'flightDayOfWeek', 'searchMonth', 'flightMonth', 'searchDay', 'flightDay',
    'isSearchWeekend', 'isFlightWeekend', 'isMajorAirline'
]

def prepare_model_input(data: dict) -> pd.DataFrame:
    for key in MODEL_FEATURES:
        if key not in data:
            raise ValueError(f"Missing required field: {key}")
    return pd.DataFrame([{key: data[key] for key in MODEL_FEATURES}])

def predict_basefare(data: dict) -> float:
    df = prepare_model_input(data)

    def run_prediction():
        return model.predict(df)[0]

    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(run_prediction)
        try:
            result = future.result(timeout=3)  
            return round(float(result), 2)
        except TimeoutError:
            raise TimeoutError("Prediction took too long (over 3 seconds)")
