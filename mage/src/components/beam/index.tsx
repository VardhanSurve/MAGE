import React from 'react'
import { AnimatedBeamMultipleOutputDemo } from './beamm'
import { AnimatedBeamMultipleOutputDemo2 } from './beamrev';
import BackdropGradient from '../bggradiant';

const Beam = () => {
    return (
        <div className='w-full flex flex-col gap-8 p-1 md:p-8'>
            <h1 className=' text-[4rem] font-bold '>Seamless Communication Flow</h1>
          {/* First Animated Beam (left side with right title and description) */}
          <div className="flex flex-col md:flex-row items-center">
            <div className=" w-[100%] md:w-[50%] p-4">
              <AnimatedBeamMultipleOutputDemo />
            </div>
            <div className="w-[90%] md:w-[50%] text-left">
            <BackdropGradient className='w-4/12 h-2/6 mt-[140px] z-[4] opacity-80' container="flex flex-col items-start">
              <h3 className="text-5xl font-semibold mb-2">User to API Flow</h3>
              <p className="text-3xl">The process starts when a user interacts with the chatbot interface by typing a question or command. This input is processed by the chatbot’s client-side logic, which sends the user's message to the backend API.</p>
              </BackdropGradient>
            </div>
          </div>
    
          {/* Second Animated Beam (right side with left title and description) */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-[100%] md:w-[50%] text-left">
            <BackdropGradient className='w-4/12 h-2/6 mt-[140px] z-[4] opacity-80' container="flex flex-col items-start">
              <h3 className="text-5xl font-semibold mb-2">API to User Flow</h3>
              <p className="text-3xl">Once the API completes its analysis or retrieves the required data, the response is formatted into a user-friendly message. This output, whether it’s an answer, a recommendation, or other content, is sent back through the same API pipeline to the chatbot interface.</p>
              </BackdropGradient>
            </div>
            <div className="w-[100%] md:w-[50%] p-4  ">
              <AnimatedBeamMultipleOutputDemo2 />
            </div>
          </div>
        </div>
      );
    };
    

export default Beam