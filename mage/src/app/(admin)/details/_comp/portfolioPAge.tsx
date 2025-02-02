"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { quantum } from 'ldrs'

quantum.register()

// Default values shown

const PortfolioPage = () => {
  const [inputText, setInputText] = useState("");
  const [htmlContent, setHtmlContent] = useState(""); // State to store API response
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast.error("Input cannot be empty");
      return;
    }
  
    setLoading(true);
    setHtmlContent(""); // Clear previous content
  
    try {
      // Call the portfolio analysis API
      const response = await axios.get("/api/portfolio", {
        params: { tickers: inputText.toUpperCase() },
      });
  
      // Process the response data to handle markdown-style formatting
      let processedContent = response.data;
  
      // Convert ### to <h3> for headings
      processedContent = processedContent.replace(/###(.*?)(?=\n|$)/g, '<h3>$1</h3>');
      
      // Convert ** to <strong> for bold text
      processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
      setHtmlContent(processedContent); // Store the processed HTML response
      console.log("Analysis fetched successfully:", processedContent);
      toast.success("Analysis fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch analysis");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-screen h-screen text-white p-8">
      {/* First Row - Company Logos */}
      <div className="grid grid-cols-5 gap-6 w-full mb-12">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="border-2 sched3 shadow-lg shadow-purple-800 hover:shadow-gray-500 hover:border-gray-500 border-purple-900 p-6 rounded-xl flex justify-center items-center w-48 h-48"
          >
            <Image
              src={`/logos/company${index}.png`} // Replace with actual logo paths
              alt={`Company ${index}`}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Second Row - Two-Part Layout */}
      <div className="grid grid-cols-10 h-screen w-[90vw] gap-6">
        {/* Left Section - Input Field & Button */}
        <div className="col-span-3  h-[400px] shadow-purple-950 flex flex-col items-center justify-center p-6 rounded-xl border-2 border-purple-900 shadow-lg">
          <h1 className="mb-3">Company name </h1>
          <Textarea
            placeholder="Enter Company Name ..."
            className="w-full p-2 text-white bg-black rounded-md mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>

        {/* Right Section - Placeholder Content */}
        <div className="col-span-7 h-[400px] relative shadow-purple-950 royal-twilight p-6 rounded-xl border-2 border-purple-900 shadow-lg overflow-auto">
          {loading ? (
            <p className="flex items-center justify-center absolute left-[45%] top-[45%] text-white">
                <l-quantum
  size="45"
  speed="1.75" 
  color="white" 
></l-quantum>
            </p>
          ) : htmlContent ? (
            <div className="max-w-[600px]" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (<p className="flex items-center justify-center left-[40%] text-white  absolute top-[45%]">Enter a Company Name and submit to analyze.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
