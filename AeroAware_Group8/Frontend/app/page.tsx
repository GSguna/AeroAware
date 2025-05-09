"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./page.css"

export default function LandingPage() {
   const router = useRouter();

   return (
      <div id="bg" className="flex flex-col min-h-screen items-center justify-center">
         <div> {/* HEADER */}
            <div className="flex flex-col items-center justify-center">
               <div className="flex items-center space-x-1">
                  <img className="bottom-10" src="/planeIcon.svg" alt="Plane Icon" />
                  <h1 className="bottom-10">Aero Aware</h1>
               </div>
               <h3 className="bottom-10">Planning a trip? Predict the price.</h3>
            </div>
         </div>
         <Card id="landing-card">
            <CardHeader>
            </CardHeader>
            <CardContent className="space-y-5">
               <div className="grid md:grid-cols-2 items-center">
                  <div>
                     <h4>About Aero Aware</h4>
                     <p id="info">
                        Aero Aware is a flight price prediction application that uses a model and various
                        user inputs to predict future flight prices of flights out of DFW. Using the destination
                        airport, flight class, date, and number of stops, the model predicts the price of the
                        ticket and total is diplayed along with the taxes and fees.
                     </p>
                     <h4 className="mt-4">How It Was Built</h4>
                     <p id="info">
                        Built with Next.js and Tailwind CSS, Aero Aware uses modern UI libraries and the XGBoost
                        machine learning library to estimate flight prices. 
                     </p>
                     {/* <p id="sponsor-info">This project is sponsored by Raytheon</p> */}
                  </div>
                  <div className="">
                     <img id="traveller-img" className="" src="/traveller.png" alt="Traveller" />
                  </div>
               </div>
            </CardContent>
         </Card>
         <Link className="" href="/home">
            <Button id="enter-button">Get Started</Button>
         </Link>
      </div>
   );
}