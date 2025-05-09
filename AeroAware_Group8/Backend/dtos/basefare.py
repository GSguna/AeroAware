from pydantic import BaseModel

class BaseFareDTO(BaseModel):
    destinationAirport: int  
    isBasicEconomy: int
    totalTravelDistance: float
    daysUntilFlight: int
    numStops: int
    mainAirlineCode: int  
    travelDurationMinutes: int
    searchDayOfWeek: int
    flightDayOfWeek: int
    searchMonth: int
    flightMonth: int
    searchDay: int
    flightDay: int
    isSearchWeekend: int
    isFlightWeekend: int
    isMajorAirline: int
