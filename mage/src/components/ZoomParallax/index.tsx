"use client";
import Image from 'next/image';
import React from 'react';
import Picture1 from "@/public/assets/background.jpg";
import Picture2 from "@/public/assets/Desktop.png";
import Picture3 from "@/public/assets/background.jpg";
import Picture4 from "@/public/assets/background.jpg";
import Picture5 from "@/public/assets/background.jpg";
import Picture6 from "@/public/assets/background.jpg";
import Picture7 from "@/public/assets/background.jpg";
import styles from './styles.module.scss';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function Indexx() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const pictures = [
    {
      src: Picture1,
      scale: scale4,
      width: '25vw',
      height: '25vh',
    },
    {
      src: Picture2,
      scale: scale5,
      top: '-30vh',
      left: '5vw',
      width: '35vw',
      height: '30vh',
    },
    {
      src: Picture3,
      scale: scale6,
      top: '-10vh',
      left: '-25vw',
      width: '20vw',
      height: '45vh',
    },
    {
      src: Picture4,
      scale: scale5,
      top: '0vh',
      left: '27.5vw',
      width: '25vw',
      height: '25vh',
    },
    {
      src: Picture5,
      scale: scale6,
      top: '27.5vh',
      left: '5vw',
      width: '20vw',
      height: '25vh',
    },
    {
      src: Picture6,
      scale: scale8,
      top: '27.5vh',
      left: '-22.5vw',
      width: '30vw',
      height: '25vh',
    },
    {
      src: Picture7,
      scale: scale9,
      top: '22.5vh',
      left: '25vw',
      width: '15vw',
      height: '15vh',
    },
  ];

  return (
    <div ref={container} className="h-[300vh] w-[90%] bg-white relative">
      <div className="sticky overflow-hidden top-0 h-[100vh] bg-orange-400">
        {pictures.map(({ src, scale, top, left, width, height }, index) => {
          return (
            <motion.div
              key={index}
              style={{ scale, top, left, width, height }}
              className="absolute flex w-[100%] h-[100%] items-center justify-center top-0 "
            >
              <div className={styles.imageContainer}>
                <Image src={src} fill alt="image" placeholder="blur" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}