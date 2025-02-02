import React from 'react'
import { Component } from '@/components/graph';
import { TableDemo } from '@/components/tabledemo';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Users, ShoppingCart } from 'lucide-react';

const DashboardPAge = () => {
  return (
    <div className='items-center justify-center flex flex-row'>
        <div className=" w-[100rem] p-6 items-center justify-center flex flex-row gap-10">
        <div className='flex flex-col midnight-abyss1 p-4 rounded-2xl border-[1px] border-gray-500 gap-6'>
        <TableDemo/>
        <Separator className='bg-white' />
        <h1>Activity Graph</h1>
        <div className='flex flex-row gap-6  justify-around'>
            <div className='flex flex-col text-gray-400 items-center justify-between gap-3'>
        <AnimatedCircularProgressBar
      max={50}
      min={0}
      value={30}
      gaugePrimaryColor="rgb(34, 197, 94)"  
      gaugeSecondaryColor="rgba(50, 50, 50, 0.2)"
      />  
                Success Rate      

      </div>
      <div className='flex flex-col gap-3 items-center text-gray-400 justify-between'>
        <AnimatedCircularProgressBar
      max={50}
      min={0}
      value={20}
  gaugePrimaryColor="rgb(220, 38, 38)"  
gaugeSecondaryColor="rgba(50, 50, 50, 0.2)"
      />  
            Failure Rate  

      </div>
         </div>
      </div>
        <div className='flex flex-col midnight-abyss1 p-4 rounded-2xl border-[1px] border-gray-500 h-[43rem] justify-around'>
        {/* Dashboard Cards */}
        <div className="flex gap-6 justify-center">
          
          {/* Card 1 */}
          <div className="border-[1px] border-gray-300  h-32 w-48 flex flex-col justify-between p-4 rounded-lg shadow-md relative">
            <TrendingUp className="absolute top-2 right-2 text-gray-400" size={20} />
            <div className="text-sm text-white text-left">Revenue</div>
            <div className="text-4xl font-semibold text-white text-center">27K</div>
            <div className="text-xs text-gray-500 text-center">This month</div>
          </div>

          {/* Card 2 */}
          <div className="border-[1px] border-gray-300 h-32 w-48 flex flex-col justify-between p-4 rounded-lg shadow-md relative">
            <Users className="absolute top-2 right-2 text-gray-400" size={20} />
            <div className="text-sm text-white text-left">Users</div>
            <div className="text-4xl font-semibold text-white text-center">12.5K</div>
            <div className="text-xs text-gray-500 text-center">Active today</div>
          </div>

          {/* Card 3 */}
          <div className="border-[1px] border-gray-300 h-32 w-48 flex flex-col justify-between p-4 rounded-lg shadow-md relative">
            <ShoppingCart className="absolute top-2 right-2 text-gray-400" size={20} />
            <div className="text-sm text-white text-left">Orders</div>
            <div className="text-4xl font-semibold text-white text-center">350</div>
            <div className="text-xs text-gray-500 text-center">Completed</div>
          </div>
          {/* Card 3 */}
          <div className="border-[1px] border-gray-300 h-32 w-48 flex flex-col justify-between p-4 rounded-lg shadow-md relative">
            <ShoppingCart className="absolute top-2 right-2 text-gray-400" size={20} />
            <div className="text-sm text-white text-left">API calls</div>
            <div className="text-4xl font-semibold text-white text-center">150</div>
            <div className="text-xs text-gray-500 text-center">Completed</div>
          </div>

        </div>
        {/* Graph Section */}
        <div className="p-4 text-center w-[50rem] rounded-lg shadow-md">
          <Component />
        </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPAge