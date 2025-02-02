"use client"
import { problem, solution } from '@/lib/item';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
  title: string;
  href: string;
  description: string;
  bgColor: string;
  textColor: string;
  zi: string;
}

const Card: React.FC<CardProps> = ({ title, href, description, bgColor, textColor, zi }) => (
    <div className={`relative w-full h-[30rem] z-${zi} bg-${bgColor} text-${textColor} rounded-2xl shadow-lg p-6 flex flex-col items-center`}>
      <div className="relative w-full">
        <img src={href} alt={title} className=" w-full h-[17rem] object-cover rounded-t-2xl" />
      </div>
      <div className="flex flex-col items-start w-full mt-[2rem]">
        <h2 className="text-body-medium font-bold mb-4">{title}</h2>
        <p className="text-body-medium text-gray-500">{description}</p>
      </div>
    </div>
  );

const ProbSolu = () => {
    useEffect(() => {
        // GSAP animation setup for problem cards
        const problemCards = document.querySelectorAll('.cards-container .card');
      
        gsap.fromTo(problemCards,
          {
            x: -200, // start position off-screen to the left
            opacity: 0,
          },
          {
            x: 50,
            opacity: 1,
            rotation: 5,
            duration: 1,
            ease: 'power2.out',
            stagger: {
              amount: 0.5,
              from: 'start',
              each: 0.1
            },
            scrollTrigger: {
              trigger: '.cards-container',
              start: 'top center',
              end: 'center center',
              scrub: true,
            }
          }
        );
      
        // GSAP animation setup for solution cards
        const solutionCards = document.querySelectorAll('.cards-containers .card');
      
        gsap.fromTo(solutionCards,
          {
            x: 200, // start position off-screen to the right
            opacity: 0,
          },
          {
            x: -50,
            opacity: 1,
            rotation: -5,
            duration: 1,
            ease: 'power2.out',
            stagger: {
              amount: 0.5,
              from: 'start',
              each: 0.1
            },
            scrollTrigger: {
              trigger: '.cards-containers',
              start: 'top center',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }, []);

    return (
        <div className="flex mt-12 justify-around p-8">
          <div className="w-full max-w-4xl flex flex-wrap justify-between">
  <div className="w-full md:w-1/2 flex flex-wrap justify-around cards-container">
    {problem.map((item, index) => (
      <div key={`problem-${index}`} className="card relative-">
        <Card
          zi='50'
          title={item.title}
          href={item.href}
          description={item.description}
          bgColor="white"
          textColor="black"
        />
      </div>
    ))}
  </div>
  <div className="w-full md:w-1/2 flex flex-wrap justify-around cards-containers">
    {solution.map((item, index) => (
      <div key={`solution-${index}`} className="card relative">
        <Card
          zi='10'
          title={item.title}
          href={item.href}
          description={item.description}
          bgColor="bg-gray-500"
          textColor="white"
        />
      </div>
    ))}
  </div>
</div>
        </div>
      );
    };

export default ProbSolu;