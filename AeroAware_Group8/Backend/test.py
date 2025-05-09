from services.flight_metrics import calculate_multi_stop_flight_metrics

def test_case_1():
    origin = 'DFW'
    stops = [0]  # Use valid destinationAirport codes from your lookup CSV
    result = calculate_multi_stop_flight_metrics(origin, stops)
    print("Test Case 1 Result:", result)

def test_case_missing():
    origin = 'DFW'
    stops = [1, 9999]  # 9999 should not be in your lookup → should return an error
    result = calculate_multi_stop_flight_metrics(origin, stops)
    print("Test Case with Missing Stop Result:", result)

if __name__ == "__main__":
    test_case_1()
    test_case_missing()
