"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./homePage.css";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogClose,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { CSVLink } from "react-csv";

export default function Home() {
   const [date, setDate] = useState<Date | undefined>(new Date());
   const [from, setFrom] = useState("");
   const [numStops, setNumStops] = useState("0");
   const [flightClass, setFlightClass] = useState("");
   const [selectedAirline, setSelectedAirline] = useState("");
   const [stopAirports, setStopAirports] = useState<string[]>([]);
   const [predictionMade, setPredictionMade] = useState(false);
   const [baseFare, setBaseFare] = useState<number>();
   const [taxesAndFees, setTaxes] = useState<number>();
   const [totalFare, setTotalFare] = useState<number>();

   useEffect(() => {
      const count = parseInt(numStops);
      setStopAirports(Array(count).fill(""));
   }, [numStops]);

   const handleStopChange = (index: number, value: string) => {
      const updatedStops = [...stopAirports];
      updatedStops[index] = value;
      setStopAirports(updatedStops);
   };

   const airports = [
      { code: "ATL", name: "Atlanta Hartsfield-Jackson International" },
      { code: "BOS", name: "Boston Logan International" },
      { code: "CLT", name: "Charlotte Douglas International" },
      { code: "DEN", name: "Denver International" },
      { code: "DTW", name: "Detroit Metropolitan Wayne County" },
      { code: "EWR", name: "Newark Liberty International" },
      { code: "IAD", name: "Washington Dulles International" },
      { code: "JFK", name: "New York John F. Kennedy International" },
      { code: "LAX", name: "Los Angeles International" },
      { code: "LGA", name: "New York LaGuardia" },
      { code: "MIA", name: "Miami International" },
      { code: "OAK", name: "Oakland International" },
      { code: "ORD", name: "Chicago O'Hare International" },
      { code: "PHL", name: "Philadelphia International" },
      { code: "SFO", name: "San Francisco International" },
   ];

   const stops = [
      { code: "1", name: "1 Stop" },
      { code: "2", name: "2 Stops" },
      { code: "3", name: "3 Stops" },
   ];

   const flightClasses = [
      { code: "Economy", name: "Economy" },
      { code: "Business", name: "Business" },
   ];

   const airlines = [
      { code: "AA", name: "American Airlines" },
      { code: "DL", name: "Delta Air Lines" },
      { code: "UA", name: "United Airlines" },
      { code: "NK", name: "Spirit Airlines" },
      { code: "B6", name: "JetBlue" },
      { code: "F9", name: "Frontier Airlines" },
      { code: "LF", name: "Contour Airlines" },
      { code: "KG", name: "Silver Airways" },
      { code: "AS", name: "Alaska Airlines" },
      { code: "4B", name: "Boutique Air" },
      { code: "SY", name: "Sun Country Airlines" },
      { code: "9X", name: "Southern Airways Express" }
    ];

   const [history, setHistory] = useState([
      { airport: "LAX *", airline: "American Airlines", stops: "2", date: "3/12/25", flightClass: "Economy", fare: "$320" },
      { airport: "JFK *", airline: "Delta Airlines", stops: "1", date: "3/6/25", flightClass: "Economy", fare: "$280" },
   ]);

   const headers = [
      { label: "Destination Airport", key: "airport" },
      { label: "Airline", key: "airline" },
      { label: "Number of Stops", key: "stops" },
      { label: "Travel Date", key: "date" },
      { label: "Flight Class", key: "flightClass" },
      { label: "Total Fare", key: "fare" },
   ];

   //Logic to predict the baseFare
   const predictBaseFare = async (fareData: any): Promise<number> => {
      try {
         const response = await fetch('http://127.0.0.1:5000/api/v1/predict-basefare', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(fareData),
         });
   
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
   
         const data = await response.json();
         const predictedBaseFare = data.predicted_baseFare
         return predictedBaseFare;
      } catch (error) {
         console.error('Error predicting base fare:', error);
         return 0;
      }
   };

   //Logic to predict if the chosen flight is a major airline
   const checkIsMajorAirline = async (airlineId: number): Promise<number | null> => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/is-major-airline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ airlineId }),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.json();
        return data.isMajorAirline;
      } catch (error) {
        console.error("Error checking if major airline:", error);
        return null;
      }
   };

   const airportMapping: { [key: string]: number } = {
      'ATL': 0, 'BOS': 1, 'CLT': 2, 'DEN': 3, 'DTW': 4,
      'EWR': 5, 'IAD': 6, 'JFK': 7, 'LAX': 8, 'LGA': 9,
      'MIA': 10, 'OAK': 11, 'ORD': 12, 'PHL': 13, 'SFO': 14
   };

   const durationAndDistanceCalculate = async (stops: number[]): Promise<{ totalDistance: number; totalDuration: number } | null> => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/calculate-multi-stop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stops }),
        });
    
        const data = await response.json();
        if (!response.ok || data.error) {
          console.error("API error:", data.error || response.statusText);
          return null;
        }
    
        return {
          totalDistance: data.totalDistance,
          totalDuration: data.totalDurationMinutes,
        };
      } catch (error) {
        console.error("API call failed:", error);
        return null;
      }
    };    

   const handlePredict = async () => {
      if (!from || !selectedAirline || !flightClass || !date) {
        alert("Please fill in all required fields.");
        return;
      }
    
      const today = new Date(); // current search date
      let daysUntilFlight = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      // If result is -0, change it to 0
      if (daysUntilFlight === -0) { daysUntilFlight = 0; }

      // this is the mapping for the number of stops
      let numberOfStops = 0;
      if(numStops === "1") { numberOfStops = 1; }
      else if (numStops === "2") { numberOfStops = 2; }
      else if (numStops === "3") { numberOfStops = 3; }

      // this is the mapping for the airport code
      let fromCode = 0;
      if(from === "ATL") { fromCode = 0;}
      else if (from === "BOS") { fromCode = 1;}
      else if (from === "CLT") { fromCode = 2;}
      else if (from === "DEN") { fromCode = 3;}
      else if (from === "DTW") { fromCode = 4;}
      else if (from === "EWR") { fromCode = 5;}
      else if (from === "IAD") { fromCode = 6;}
      else if (from === "JFK") { fromCode = 7;}
      else if (from === "LAX") { fromCode = 8;}
      else if (from === "LGA") { fromCode = 9;}
      else if (from === "MIA") { fromCode = 10;}
      else if (from === "OAK") { fromCode = 11;}
      else if (from === "ORD") { fromCode = 12;}
      else if (from === "PHL") { fromCode = 13;}
      else if (from === "SFO") { fromCode = 14;}

      // this is the mapping for the airline code
      const airlineCodeToId: { [key: string]: number } = {
         "F9": 0,
         "NK": 1,
         "AA": 2,
         "UA": 3,
         "DL": 4,
         "B6": 5,
         "LF": 6,
         "KG": 7,
         "AS": 8,
         "4B": 9,
         "SY": 10,
         "9X": 11,
       };
       
       const airlineCode = airlineCodeToId[selectedAirline];
       if (airlineCode === undefined) {
         alert("Invalid airline selected.");
         return;
       }
       
       const majorAirline = await checkIsMajorAirline(airlineCode);
       if (majorAirline === null) {
         alert("Failed to verify if airline is major.");
         return;
       }

      const mappedStops = [from, ...stopAirports]
      .map(code => airportMapping[code])
      .filter(val => val !== undefined);

      if (mappedStops.length !== stopAirports.length + 1) {
         alert("One or more airport codes are invalid.");
         return;
      }

       const flightMetrics = await durationAndDistanceCalculate(mappedStops);
       if (flightMetrics === null) {
         alert("Could not calculate flight metrics.");
         return;
       }
       
       const totalDistance = flightMetrics.totalDistance;
       const totalDuration = flightMetrics.totalDuration;

      // Data feed to the backend for prediction
      const fareData = {
         destinationAirport: fromCode, 
         isBasicEconomy: flightClass === "Economy" ? 1 : 0, 
         totalTravelDistance: totalDistance, 
         daysUntilFlight: daysUntilFlight, 
         numStops: numberOfStops, 
         mainAirlineCode: airlineCode, 
         travelDurationMinutes: totalDuration, 

         searchDayOfWeek: today.getDay(), 
         flightDayOfWeek: date.getDay(), 
         searchMonth: today.getMonth() + 1, 
         flightMonth: date.getMonth() + 1, 
         searchDay: today.getDate(), 
         flightDay: date.getDate(), 
         isSearchWeekend: [0, 6].includes(today.getDay()) ? 1 : 0, 
         isFlightWeekend: [0, 6].includes(date.getDay()) ? 1 : 0, 
         isMajorAirline: majorAirline 
      };
    
      const predictedFare: number = await predictBaseFare(fareData);
      setBaseFare(predictedFare)
      if (baseFare === null) {
        alert("Prediction failed. Try again.");
        return;
      }
    
      // Calculation for Taxes
      const federalET = predictedFare * 0.075;
      let segmentFee = 0;
      let passFacCharge = 0;
      if (numberOfStops >= 1) {
         segmentFee = 10.40 * numberOfStops;
         passFacCharge = 9.00;
      }
      else {
         segmentFee = 5.20
         passFacCharge = 4.50;
      }
      const sept11Fee = 5.60;
      const taxesAndFees = federalET + segmentFee + passFacCharge + sept11Fee;
      setTaxes(Number((taxesAndFees).toFixed(2)))
      setTotalFare(Number((predictedFare + taxesAndFees).toFixed(2))); // fixed to only 2 decimal places after the dot
    
      const newPrediction = {
        airport: from,
        airline: selectedAirline,
        stops: numStops,
        date: date ? date.toLocaleDateString() : "",
        flightClass: flightClass,
        fare: `$${(predictedFare + taxesAndFees).toFixed(2)}`,
      };
    
      setHistory([...history, newPrediction]);
      setPredictionMade(true);
    };

   return (
      <div id="bg" className="flex flex-col items-center min-h-screen">
         <div> {/* HEADER */}
            <div className="flex flex-col items-center py-12">
               <div className="flex items-center space-x-1">
                  <img src="/planeIcon.svg" alt="Plane Icon" />
                  <h1>Aero Aware</h1>
               </div>
               <h3>Planning a trip? Predict the price.</h3>
            </div>

            <div className="grid md:grid-cols-3"> {/* USER INPUTS CARD*/}
               <Card id="card" className="md:col-span-2">
                  <CardContent>
                     <div className="grid md:grid-cols-2 gap-23">
                        <div> {/* DESTINATION AIRPORT */}
                           <label id="destination" className="font-medium block">Destination Airport</label>
                           <Select value={from} onValueChange={setFrom}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select destination airport" />
                              </SelectTrigger>
                              <SelectContent>
                                 {airports.map((airport) => (
                                    <SelectItem key={airport.code} value={airport.code}>
                                       {airport.code}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                        <div> {/* FLIGHT CLASS */}
                           <label id="num-stops" className="font-medium block">Flight Class</label>
                           <Select value={flightClass} onValueChange={setFlightClass}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select flight class" />
                              </SelectTrigger>
                              <SelectContent>
                                 {flightClasses.map((flightClass) => (
                                    <SelectItem key={flightClass.code} value={flightClass.code}>
                                       {flightClass.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-23 mt-11"> 
                        <div> {/* DEPARTURE DATE*/}
                           <label id="travelDate" className="font-medium block">Departure Date</label>
                           <Calendar id="calendar"
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              className="rounded-md border shadow"
                              initialFocus
                           />
                        </div>

                        <div>
                           <label id="airline" className="font-medium block">Airline</label> {/* AIRLINE */}
                           <div id="airline-dropdown">
                              <Select value={selectedAirline} onValueChange={setSelectedAirline}>
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select airline" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {airlines.map((airline) => (
                                       <SelectItem key={airline.code} value={airline.code}>
                                          {airline.name} {/* took out airline.code */}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                              
                           
                           <label id="num-stops" className="font-medium block">Number of Stops</label> {/* NUM STOPS */}
                           <Select value={numStops} onValueChange={setNumStops}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select number of stops" />
                              </SelectTrigger>
                              <SelectContent>
                                 {stops.map((stop) => (
                                    <SelectItem key={stop.code} value={stop.code}>
                                       {stop.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>

                           <div className="mt-6"> {/* STOPS POP-UP */}
                              <div id="stops-details">
                                 <p className="font-medium">Selected stops details:</p>
                                 <ul className="list-disc ml-5 mt-2">
                                    {stopAirports.map((code, index) => (
                                       <li key={index}>
                                          Stop {index + 1}: {code || "Not selected"}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                              <Dialog>
                                 <DialogTrigger asChild>
                                    <Button id="edit-stops-button" className="mt-5">
                                       Edit Stops
                                    </Button>
                                 </DialogTrigger>
                                 <DialogContent id="stops-dialog">
                                    <DialogHeader>
                                       <DialogTitle>Stops</DialogTitle>
                                       <DialogClose asChild />
                                    </DialogHeader>
                                    {stopAirports.map((selectedStop, index) => (
                                       <div key={index} className="mb-4">
                                          <label id="stops" className="font-medium block">Stop {index + 1}</label>
                                          <Select
                                             value={selectedStop}
                                             onValueChange={(val) => handleStopChange(index, val)}
                                          >
                                             <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select airport" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                {airports
                                                   .filter((airport) =>
                                                      (airport.code === selectedStop || (!stopAirports.includes(airport.code) && airport.code !== from)))
                                                   .map((airport) => (
                                                      <SelectItem key={airport.code} value={airport.code}>
                                                         {airport.code}
                                                      </SelectItem>
                                                   ))}
                                             </SelectContent>
                                          </Select>
                                       </div>
                                    ))}
                                    <DialogClose asChild>
                                    <Button id="save-button" className="mt-1">
                                       Save
                                    </Button>
                                    </DialogClose>
                                 </DialogContent>
                              </Dialog>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="flex flex-col items-end">
                  <Card id="cardPrice"> {/* PREDICTED PRICE */}
                     <CardHeader>
                        <CardTitle id="priceHeader">Predicted Price</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {predictionMade ? (
                           <div>
                              <p id="pricetext">Base Fare:</p>
                              <p id="price">${baseFare}</p>
                              <p id="pricetext">Taxes and Fees:</p>
                              <p id="price">${taxesAndFees}</p>
                              <p id="pricetext">Total Fare:</p>
                              <div className="flex items-center">
                                 <p id="priceTotal">${totalFare}</p>
                                 <p id="priceNote" className="text-sm text-gray-500 ml-2">*Prices can be fluctuated slightly</p>
                              </div>
                           </div>
                        ) : (
                           <div className="flex items-center justify-center text-gray-400 p-3">
                              <p>Click Predict to see the price</p>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  <Dialog> {/* HISTORY POPUP */}
                     <DialogTrigger asChild>
                        <Button id="view-history-button" className="mt-4">
                           View My History
                        </Button>
                     </DialogTrigger>
                     <DialogContent id="history-dialog-content">
                        <DialogHeader>
                           <DialogTitle>History</DialogTitle>
                           <DialogClose asChild />
                        </DialogHeader>
                        <div>
                           <Table>
                              <TableHeader>
                                 <TableRow>
                                    <TableHead>Destination Airport</TableHead>
                                    <TableHead>Airline</TableHead>
                                    <TableHead>Number of Stops</TableHead>
                                    <TableHead>Travel Date</TableHead>
                                    <TableHead>Flight Class</TableHead>
                                    <TableHead>Total Fare</TableHead>
                                 </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {history.map((item, index) => (
                                    <TableRow key={index}>
                                       <TableCell>{item.airport}</TableCell>
                                       <TableCell>{item.airline}</TableCell>
                                       <TableCell>{item.stops}</TableCell>
                                       <TableCell>{item.date}</TableCell>
                                       <TableCell>{item.flightClass}</TableCell>
                                       <TableCell>{item.fare}</TableCell>
                                    </TableRow>
                                 ))}
                              </TableBody>
                           </Table>
                           <div className="text-right mt-4">
                              <CSVLink
                                 data={history}
                                 headers={headers}
                                 filename={"history.csv"}
                                 className="download-csv-button mt-4 inline-block text-center py-2 px-4 rounded-md"
                              >
                                 Download CSV
                              </CSVLink>
                           </div>
                        </div>
                     </DialogContent>
                  </Dialog>
               </div>
            </div>

            <Button id="predict-button" disabled={stopAirports.includes("")} onClick={handlePredict}>
               Predict Price
            </Button>
         </div>
      </div>
   );
}
