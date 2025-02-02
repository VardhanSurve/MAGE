import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "../ui/bentogrid";

export function BentoGridDemo() {
  return (
    <div className="relative">
      {/* Title positioned at the center top */}
      <h1 className="absolute top-0 left-0 right-0 text-center text-[1.3rem]  md:text-[2.4rem] font-bold">
        Start Your AI Transformation Now
      </h1>
      <BentoGrid className="w-[100%] mt-14 md:mt-[6rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            link={item.link} // Pass the link prop here
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const items = [
  {
    header: <img src="/app-ui.png" alt="Innovation" className="rounded-xl w-full h-[90%]" />,
    link: "/bots", // Add the path for navigation
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <img src="/assets/Desktop.png" alt="Digital Revolution" className="rounded-xl w-full h-[50%]" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    link: "/bots", // Add the path for navigation
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <img src="/assets/Desktop.png" alt="Art of Design" className="rounded-xl w-full h-[50%]" />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    link: "/bots", // Add the path for navigation
  },
  {
    title: "The Power of Communication",
    description: "Understand the impact of effective communication in our lives.",
    header: <img src="/assets/Desktop.png" alt="Power of Communication" className="rounded-xl w-full h-[60%]" />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    link: "/bots", // Add the path for navigation
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    header: <img src="/assets/Desktop.png" alt="Pursuit of Knowledge" className="rounded-xl w-full h-[50%]" />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    link: "/bots", // Add the path for navigation
  },

]