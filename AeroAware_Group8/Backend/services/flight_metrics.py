from services.lookup_loader import distance_lookup, duration_lookup
from flask import jsonify  # only if used inside your Flask route (not needed in this function)
import math

def calculate_multi_stop_flight_metrics(origin_code, stops_list):
    total_distance = 0.0
    total_duration = 0.0

    for stop_id in stops_list:
        try:
            dist = distance_lookup.loc[distance_lookup['destinationAirport'] == stop_id, 'avgDirectFlightDistance'].values[0]
            dur = duration_lookup.loc[duration_lookup['destinationAirport'] == stop_id, 'avgDirectFlightDurationMinutes'].values[0]
        except IndexError:
            return {"error": f"Direct flight from DFW to airport ID {stop_id} not found in lookup tables."}

        total_distance += dist
        total_duration += dur

    return {
        "totalDistance": round(total_distance, 2),
        "totalDurationMinutes": int(math.ceil(total_duration))
    }
