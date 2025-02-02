// src/components/ProjectsSection.js
"use client"
import { projects } from '@/lib/item';
import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import Card from '.';

const ProjectsSection = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  return (
<div className="relative">
      {/* Title positioned at the center top */}
      <h1 className="absolute top-0 left-0 right-0 text-center text-2xl md:text-[4rem] font-bold mt-24">
        Steps to create Your Chatbot
      </h1>

      {/* Cards Section */}
      <main ref={container} className="w-[80rem] mt-[5rem] md:mt-[15rem]"> {/* Added padding to avoid overlapping the title */}
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <Card
              key={i}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </div>

  );
};

export default ProjectsSection;