"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./errorPage.css"

export default function NotFound() {
  const router = useRouter();

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
        </div>
        <div> {/* adjust height as needed w-full  relative  w-full h-full*/}
            <img id="plane-image" src="/plane.png" alt="Plane Background"  />
            <div id="error-content">
                <h1 className="error-code">404</h1>
                <h3 className="error-message">Page Not Found</h3>
                <Button id="home-button" onClick={() => router.push("/home")} className="mt-4">Back to Home</Button>
            </div>
        </div>
      </div>
   );
}