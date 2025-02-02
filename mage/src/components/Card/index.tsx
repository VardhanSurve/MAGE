'use client'

import { useRef } from 'react';
import Image from 'next/image';
import { useTransform, motion, useScroll } from 'framer-motion';
import Particles from '../ui/particles';

export default function index ({
  title,
  description,
  src,
  link,
  i,
  progress, range, targetScale,
}: {
  title: string;
  src: string;
  i:number;
  description: string;
  link: string;
  progress:any;
  range:number[];
  targetScale:number;
}) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <div>
        <motion.div
          className={`flex flex-col bg-black overflow-hidden  relative rounded-[1.5625rem] border-gray-600 border-2 p-[0.625rem]  w-[20rem] lg:w-[60rem] md:w-[45rem] max-w-4xl md:max-w-6xl h-[30rem] md:h-[34.125rem] `}
          style={{scale,top:`calc(-5vh + ${i * 25}px)`
        ,        boxShadow: "inset 0 0 70px 0px #ff0080, inset 0 -2px 0 0 transparent",
      }}
        >
            <Particles
        className="absolute inset-0 z-[5] flex items-center justify-center"
        quantity={100}
        ease={80}
        refresh
      />
                {/* <div className="absolute opacity-90 pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_90%,black)]"></div> */}
               <div className="absolute top-0 left-0 h-full w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -70px 40px 0px black", // inner bottom shadow
        }}></div>
          <h2 className="text-left font-bold mt-4 text-[1.75rem] w-full text-2xl">{title}</h2>
          <div className='bg-white w-full h-[2px] mt-6' ></div>
          <div className="flex flex-col md:flex-row w-[99%] justify-around h-[70%] md:h-[80%]  mt-[1.125rem] gap-[2.125rem]"
          >
            <div className="   p-7 max-w-[25rem] lg:max-w-[35rem] hidden md:block">
              <p className=" text-[0.8rem] md:text-[1rem]">
                <span className="first-letter:text-[1.75rem] text-xl first-letter:font-title">{description}</span>
              </p>
              <span className="flex items-center gap-[0.3125rem]">
                <a href={link} target="_blank" className="text-[0.75rem] text-white underline cursor-pointer">See more</a>
                <svg width="1.375rem" height="0.75rem" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z" fill="black"/>
                </svg>
              </span>
            </div>
            <div className="relative  w-full md:w-[90%] h-full rounded-[1.5625rem] overflow-hidden">
            <motion.div
              className="w-[100%] h-[100%] "
              style={{scale: imageScale}}
            >
              <Image
                fill
                src={`${src}`}
                alt="image"
                className="object-contain"
              />
                          </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}