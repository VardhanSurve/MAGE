"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { data as weeklyIBM } from "@/lib/weekIBM"; // Importing weekly IBM data
import { stockData as dailyIBM } from "@/lib/IBMDaily"; // Importing daily IBM data

import { data as weeklyMSFT } from "@/lib/MSFTweeekly_data"; // Importing weekly MSFT data
import { stockData as dailyMSFT } from "@/lib/MSFT_data"; // Importing daily MSFT data

import { data as weeklyApple } from "@/lib/AAPLweekly_data"; // Importing weekly Apple data
import { stockData as dailyApple } from "@/lib/Apple_data"; // Importing daily Apple data

import { data as weeklyTesla } from "@/lib/TSLAweekly_data"; // Importing weekly Tesla data
import { stockData as dailyTesla } from "@/lib/TSLA_data"; // Importing daily Google data

import { Separator } from "@/components/ui/separator";

const Page = () => {
  const [weeklyIBMData, setWeeklyIBMData] = useState<any[]>([]);
  const [dailyIBMData, setDailyIBMData] = useState<any[]>([]);

  const [weeklyMSFTData, setWeeklyMSFTData] = useState<any[]>([]);
  const [dailyMSFTData, setDailyMSFTData] = useState<any[]>([]);

  const [weeklyAppleData, setWeeklyAppleData] = useState<any[]>([]);
  const [dailyAppleData, setDailyAppleData] = useState<any[]>([]);

  const [weeklyTeslaData, setWeeklyTeslaData] = useState<any[]>([]);
  const [dailyTeslaData, setDailyTeslaData] = useState<any[]>([]);


  useEffect(() => {
    // Transform Weekly and Daily Data for IBM, MSFT, Apple, and Tesla
    const transformedWeeklyIBM = Object.keys(weeklyIBM.weeklyTimeSeries).map((date) => ({
      name: date,
      uv: parseFloat(weeklyIBM.weeklyTimeSeries[date].close),
    }));
    setWeeklyIBMData(transformedWeeklyIBM);

    const transformedDailyIBM = dailyIBM.map((entry) => ({
      name: entry.date,
      uv: entry.close,
    }));
    setDailyIBMData(transformedDailyIBM);

    const transformedWeeklyMSFT = Object.keys(weeklyMSFT.weeklyTimeSeries).map((date) => ({
      name: date,
      uv: parseFloat(weeklyMSFT.weeklyTimeSeries[date].close),
    }));
    setWeeklyMSFTData(transformedWeeklyMSFT);

    const transformedDailyMSFT = dailyMSFT.map((entry) => ({
      name: entry.date,
      uv: entry.close,
    }));
    setDailyMSFTData(transformedDailyMSFT);

    const transformedWeeklyApple = Object.keys(weeklyApple.weeklyTimeSeries).map((date) => ({
      name: date,
      uv: parseFloat(weeklyApple.weeklyTimeSeries[date].close),
    }));
    setWeeklyAppleData(transformedWeeklyApple);

    const transformedDailyApple = dailyApple.map((entry) => ({
      name: entry.date,
      uv: entry.close,
    }));
    setDailyAppleData(transformedDailyApple);

    const transformedWeeklyTesla = Object.keys(weeklyTesla.weeklyTimeSeries).map((date) => ({
      name: date,
      uv: parseFloat(weeklyTesla.weeklyTimeSeries[date].close),
    }));
    setWeeklyTeslaData(transformedWeeklyTesla);

    const transformedDailyTesla = dailyTesla.map((entry) => ({
      name: entry.date,
      uv: entry.close,
    }));
    setDailyTeslaData(transformedDailyTesla);

  }, []);


  if (
    weeklyIBMData.length === 0 ||
    dailyIBMData.length === 0 ||
    weeklyMSFTData.length === 0 ||
    dailyMSFTData.length === 0 ||
    weeklyAppleData.length === 0 ||
    weeklyTeslaData.length === 0 ||
    dailyTeslaData.length === 0
  ) {
    return <div>Loading...</div>;
  }

  const maxWeeklyIBM = Math.max(...weeklyIBMData.map((item) => item.uv));
  const minWeeklyIBM = Math.min(...weeklyIBMData.map((item) => item.uv));

  const maxDailyIBM = Math.max(...dailyIBMData.map((item) => item.uv));
  const minDailyIBM = Math.min(...dailyIBMData.map((item) => item.uv));

  const maxWeeklyMSFT = Math.max(...weeklyMSFTData.map((item) => item.uv));
  const minWeeklyMSFT = Math.min(...weeklyMSFTData.map((item) => item.uv));

  const maxDailyMSFT = Math.max(...dailyMSFTData.map((item) => item.uv));
  const minDailyMSFT = Math.min(...dailyMSFTData.map((item) => item.uv));

  const maxWeeklyApple = Math.max(...weeklyAppleData.map((item) => item.uv));
  const minWeeklyApple = Math.min(...weeklyAppleData.map((item) => item.uv));

  const maxDailyApple = Math.max(...dailyAppleData.map((item) => item.uv));
  const minDailyApple = Math.min(...dailyAppleData.map((item) => item.uv));

  const maxWeeklyTesla = Math.max(...weeklyTeslaData.map((item) => item.uv));
  const minWeeklyTesla = Math.min(...weeklyTeslaData.map((item) => item.uv));

  const maxDailyTesla = Math.max(...dailyTeslaData.map((item) => item.uv));
  const minDailyTesla = Math.min(...dailyTeslaData.map((item) => item.uv));


  return (
    <div className="royal-twilight min-h-screen flex flex-col justify-evenly">
      {/*  IBM Data */}
      <div className="flex justify-center  flex-col p-4 items-start">
  <h3 className="mb-4 font-semibold text-gradient5 text-4xl">IBM Finance Detail</h3>
  <div className="flex flex-row w-full gap-4">
    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Weekly</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={weeklyIBMData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minWeeklyIBM, maxWeeklyIBM]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Daily</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={dailyIBMData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minDailyIBM, maxDailyIBM]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

<Separator/>

      {/*Apple Data */}
      <div className="flex justify-center flex-col p-4 items-start">
  <h3 className="mb-4 font-semibold  text-gradient5 text-4xl">Apple Finance Detail</h3>
  <div className="flex flex-row w-full gap-4">
    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Weekly</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={weeklyAppleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minWeeklyApple, maxWeeklyApple]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Daily</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={dailyMSFTData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minDailyMSFT, maxDailyMSFT]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
<Separator/>

      {/* Daily Tesla Data */}
      <div className="flex justify-center flex-col p-4 items-start">
  <h3 className="mb-4 font-semibold  text-gradient5 text-4xl">Tesla Finance Detail</h3>
  <div className="flex flex-row w-full gap-4">
    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Weekly</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={weeklyTeslaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minWeeklyTesla, maxWeeklyTesla]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Daily</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={dailyTeslaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minDailyTesla, maxDailyTesla]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
<Separator/>

      {/* Daily MSFO Data */}
      <div className="flex justify-center flex-col p-4 items-start">
  <h3 className="mb-4 font-semibold text-gradient5 text-4xl">MSFT Finance Detail</h3>
  <div className="flex flex-row w-full gap-4">
    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Weekly</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={weeklyMSFTData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minWeeklyMSFT, maxWeeklyMSFT]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex flex-col w-full sm:w-1/2">
      <h2 className="mb-2">Daily</h2>
      <ResponsiveContainer className="obsidian-night" width="100%" height={400}>
        <LineChart data={dailyMSFTData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[minDailyMSFT, maxDailyMSFT]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
    </div>
  );
};

export default Page;
