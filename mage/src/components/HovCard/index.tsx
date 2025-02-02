import React from 'react';
import { FaAws, FaCloud, FaAdn } from 'react-icons/fa';
import DotPattern from '../ui/dots';
import { cn } from '@/lib/utils';

const CardIndex = () => {
  return (
    <div className=" w-[100%] md:w-[70%] p-6 bg-black text-white">
      {/* Title */}
      <h2 className="text-5xl font-bold text-center mb-8">Cloud and AI Features</h2>

      {/* Card Row */}
      <div className="flex md:flex-row flex-col gap-8 justify-center">

        {/* Card 1 */}
        <div className=" w-[100%] md:min-w-[350px] md:w-[400px] h-[20rem] bg-black border-2 border-gray-500 rounded-2xl shadow-lg transition-all hover:shadow-2xl hover:border-2 hover:border-gray-500 group relative">
      
      {/* DotPattern visible only on hover */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]", 
          "opacity-0 group-hover:opacity-100  transition-opacity duration-300"
        )}
      />

      <div className="p-6">
        
        {/* Icons with border, shadow on hover */}
        <div className="flex justify-evenly z-[3] items-center mt-[14%] group">
  <div
    className="border-2  border-gray-500  p-5 rounded-2xl transition-all group-hover:shadow-[inset_0_0_40px_5px_#9c979e8c,inset_0_-2px_0_0_transparent]"
  >
              <img src="/vect/pinecone.png" className="md:h-12 md:w-12 h-8 w-8 object-contain" alt=""></img>
              </div>
  <div
    className="border-2 border-gray-500  p-5 rounded-2xl transition-all group-hover:shadow-[inset_0_0_40px_5px_#9c979e8c,inset_0_-2px_0_0_transparent]"
  >
              <img src="/vect/faiss.png" className="md:h-12 md:w-12 h-8 w-8 object-contain" alt=""></img>

    {/* <FaCloud className="md:h-12 md:w-12 h-8 w-8 text-white transition-all" /> */}
  </div>
  <div
    className="border-2 border-gray-500  p-5 rounded-2xl transition-all group-hover:shadow-[inset_0_0_40px_5px_#9c979e8c,inset_0_-2px_0_0_transparent]"
  >
              <img src="/vect/chroma.png" className="md:h-12 md:w-12 h-8 w-8 object-contain" alt=""></img>
              </div>
</div>

<h1 className="bottom-10 absolute text-center text-xl opacity-100 group-hover:opacity-0 transition-all">
Deploy and scale on a secure platform ready for production</h1>
        {/* Text scattered around the container, initially hidden */}
        <div className="relative group">
  {/* Top-left text */}
  <p className="absolute top-10 bg-black px-5  left-4 text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Scale
  </p>
  {/* Top-center text */}
  <p className="absolute bg-black top-10 left-1/2 px-5  transform -translate-x-1/2 text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Chroma
  </p>
  {/* Bottom-left text */}
  <p className="absolute bottom-20 md:bottom-28 bg-black left-20 px-5 text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Fiass
  </p>
  {/* Bottom-right text */}
  <p className="absolute bottom-20  bg-black right-4  px-5  text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Pinecone
  </p>
</div>



      </div>
    </div>

        {/* Card 2 */}
        <div className="w-[100%] md:min-w-[350px] md:w-[400px] h-[20rem] bg-black border-2 border-gray-500 rounded-2xl shadow-lg transition-all hover:shadow-2xl hover:border-2 hover:border-gray-500 group relative"
         style={{
        boxShadow: "inset 0 0 40px 1px #00ffff, inset 0 -2px 0 0 transparent",
      }}>
      
      {/* DotPattern visible only on hover */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]", 
          "opacity-0 group-hover:opacity-100  transition-opacity duration-300"
        )}
      />

      <div className="p-6">
        
        {/* Icons with border, shadow on hover */}
        <div className="flex justify-evenly z-[3] items-center mt-[14%] group">
  <div
    className="border-2  border-gray-500  p-5 rounded-2xl transition-all group-hover:shadow-[inset_0_0_40px_5px_#9c979e8c,inset_0_-2px_0_0_transparent]"
  >
    <FaAws className="md:h-12 md:w-12 h-8 w-8 text-white transition-all " />
  </div>
  <div
    className="border-2 border-gray-500  p-5 rounded-2xl transition-all group-hover:shadow-[inset_0_0_40px_5px_#9c979e8c,inset_0_-2px_0_0_transparent]"
  >
    <FaCloud className="md:h-12 md:w-12 h-8 w-8 text-white transition-all" />
  </div>
  <div
    className="border-2 border-gray-500  p-5 rounded-2xl transition-all group-hover:shadow-[inset_0_0_40px_5px_#9c979e8c,inset_0_-2px_0_0_transparent]"
  >
    <FaAdn className="md:h-12 md:w-12 h-8 w-8 text-white transition-all" />
  </div>
</div>

<h1 className="bottom-10 absolute text-center  text-xl opacity-100 group-hover:opacity-0 transition-all">
Deploy yourself or sign up for a account</h1>
        {/* Text scattered around the container, initially hidden */}
        <div className="relative group">
  {/* Top-left text */}
  <p className="absolute top-10 bg-black px-5  left-4 text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Scale
  </p>
  {/* Top-center text */}
  <p className="absolute bg-black top-10 left-1/2 px-5  transform -translate-x-1/2 text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Cloud
  </p>
  {/* Bottom-left text */}
  <p className="absolute bottom-20 md:bottom-28 bg-black left-20 px-5 text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Speed
  </p>
  {/* Bottom-right text */}
  <p className="absolute bottom-20  bg-black right-4  px-5  text-sm border-2 border-transparent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 group-hover:border-green-200 group-hover:text-green-200 group-hover:shadow-[0_0_20px_5px_#91f89186]">
    Deploy
  </p>
</div>



      </div>
    </div>

      </div>
    </div>
  );
};

export default CardIndex;
