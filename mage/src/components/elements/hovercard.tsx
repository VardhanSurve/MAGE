"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "../ui/canvas-reveal";

export function CanvasRevealEffectDemo() {
  return (
    <>
    <div className="mt-20 flex flex-row items-center justify-center text-4xl font-bold text-heading4-medium" >
    <p>Say Goodbye to Tedious Tasks</p>
    </div>
      <div className="py-10 flex flex-col md:flex-row items-center justify-center bg-white dark:bg-[#0A0A0A] w-full gap-4 mx-auto px-8">
        
        <Card 
          title="Sheetal is Nisha" 
          description="nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads"
          pTitle="Sheetal is Nisha"
          pDescription="nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads"
        >
          <CanvasRevealEffect
            animationSpeed={3.1}
            containerClassName="bg-[#171717]"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
        </Card>
        <Card 
          title="Nisha is Munni" 
          description="nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads"
          pTitle="New Title 2"
          pDescription="nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads"
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-[#171717]"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
        </Card>
        <Card 
          title="Munni is Aditi" 
          description="nonosnd oanoa sndndas ads asdd asa sdads asd d saas dasd ads"
          pTitle="New Title 3"
          pDescription="New Description 3"
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-[#171717]"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
        </Card>
      </div>
    </>
  );
}

const Card = ({
  title,
  children,
  description,
  pTitle,
  pDescription,

}: {
  title: string;
  children?: React.ReactNode;
  description: string;
  pTitle: string;
  pDescription: string;

}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    // Dynamically remove 'rounded-3xl' on hover using template literals
    className={`border shadow-md bg-[#171717] border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[27rem] relative transition-all duration-200 ${
      hovered ? '' : 'rounded-3xl'
    }`}
  >

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-8 px-3  h-[20rem] relative z-20 group">
  <div className="items-start flex-col w-full mx-auto flex">
    <h3 className="dark:text-white text-heading4-medium group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 ">{pTitle}</h3>
    <p className="dark:text-white mt-9 text-base-semibold group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200">{pDescription}</p>

  <h2 className="dark:text-white text-heading4-medium opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
    {title}
  </h2>
  <p className="dark:text-white text-base-semibold opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-10 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
    {description}
  </p>
  </div>

  {/* Hover and Tap text positioned at the bottom right */}
  <div className="absolute  bottom-2 right-4 transition-opacity duration-200 group-hover:opacity-0">
    <p className="hidden md:inline my-11 text-xs text-gray-500 dark:text-gray-400">Hover to see more</p>
    <p className="inline md:hidden text-xs text-gray-500 dark:text-gray-400">Tap to see more</p>
  </div>
</div>
</div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};