"use client"
import React from "react";
import { CanvasRevealEffectDemo } from "@/components/elements/hovercard";
import { BentoGridDemo } from "@/components/elements/bento";
import ProjectsSection from "@/components/Card/projectsction";
import Footer from "@/components/homescreen/footer";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import IconCloud from "@/components/ui/icon-cloud";
import { Button } from "@/components/ui/button";
import {  useRouter } from 'next/navigation'; // Import navigation functions
import DotPattern from "@/components/ui/dots";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/ui/aurora-background";
import InteractiveHoverButton from "@/components/ui/animabut";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Compare } from "@/components/ui/compare";
import Image from 'next/image';
import Beam from "@/components/beam";
import HovCard from "@/components/HovCard";
import { MarqueeDemo } from "@/components/review";
import { FaCheck, FaTimes } from "react-icons/fa"
import BackdropGradient from "@/components/bggradiant";
export default function Home() {
  // console.log({ Spotlight, ModelCanvas });
  const router = useRouter(); // Initialize router for navigation
  const handleRedirect = () => {
    router.push('/AdminSignin'); // Redirects the user to the sign-in page
  };
  const slugs = [
    "typescript",
    "javascript",
    "notion",
    "react",
    "googledrive",
    "slack",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "firebase",
    "vercel",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "python",
    "langchain"
  ];
  return (
    <main className="flex flex-col bg-black items-center justify-center">
      {/* hero section */}
      <AuroraBackground>
      <section
  className="h-screen w-screen !overflow-visible relative flex flex-col items-center antialiased"

>
<DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
<div className="w-full h-screen flex flex-col md:flex-row items-center gap-6 px-6 md:gap-12 md:px-12">
<div
  className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
  style={{
    backgroundImage:
      "radial-gradient(125% 125% at 50% 10%, #0a0a0a 20%, transparent)",  // Dark Purple
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
></div>


<div className="flex-1 z-[2] flex flex-col  items-center justify-center p-12">
<h1 className="  bg-black px-4 border-2 mt-[14%] md:mt-0 border-gray-500 rounded-2xl font-bold lg:text-[6.5rem] text-[2.75rem] ">
      <span className="text-gradient2">MA</span>  
        <span className=" font-bold text-gradient2">GE</span>
      </h1>
      <p className="text-center lg:text-lg text-base  text-[#F4F4F4] mt-4 px-6 md:px-0">
        Welcome to the future of AI! MAGE empowers you with cutting-edge technology to explore endless possibilities.
      </p>
      <div className="flex flex-row justify-center mt-5 w-[80%] md:w-[100%] " >
        <InteractiveHoverButton
        text="Get Started"
        onClick={handleRedirect}
        className="w-[13rem] ethereal-chill h-[3rem] md:h-[3.4rem] border-white "
        />
      <Button 
        variant="outline" 
        className="bg-transparent ml-4 border-2 w-[13rem] h-[3rem] md:h-[3.4rem] border-[#885aa1] text-lg text-white rounded-xl  "
        onClick={handleRedirect} 
        >
        Documentation
      </Button>
        </div>
    </div>
<div className="flex-1 relative hidden md:flex flex-col items-center justify-center mt-[5%] " >
<div className="w-[350px] ">
  <Card className=" shadow-lg border-2 border-gray-500 bg-black text-white rounded-2xl" >
    <CardContent className="space-y-4">
      {/* Input Field */}
      <div className="space-y-2  mt-[4%] ">
        <Label htmlFor="name" className="text-sm font-medium">
          Input
        </Label>
        <Input
          id="name"
          placeholder="Type name here"
          className="bg-black w-full  focus:ring-[#1E90FF]"
        />
      </div>

      {/* Slider Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center justify-between">
          Temperature
          <span id="slider-value" className="text-sm font-bold text-gray-300">
            0.33
          </span>
        </Label>
        <Slider
          className="mt-2 "
          defaultValue={[0.33]}
          max={1}
          step={0.01}
          onValueChange={(value) => {
            const sliderValueElement = document.getElementById(
              "slider-value"
            ) as HTMLElement;
            if (sliderValueElement && value.length > 0) {
              sliderValueElement.textContent = value[0].toFixed(2);
            }
          }}
        />
      </div>

      {/* Select Section */}
      <div className="space-y-2">
        <Label htmlFor="select" className="text-sm font-medium">
          Model
        </Label>
        <Select>
          <SelectTrigger
            id="select"
            className="w-full  focus:ring-[#1E90FF]"
          >
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Models</SelectLabel>
              <SelectItem value="apple">Fiass</SelectItem>
              <SelectItem value="banana">Pinecone</SelectItem>
              <SelectItem value="blueberry">OpenAPI</SelectItem>
              <SelectItem value="grapes">Notion</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* API Key Section */}
      <div className="space-y-2">
        <Label htmlFor="api-key" className="text-sm font-medium">
          API Key
        </Label>
        <Input
          id="api-key"
          placeholder="Type API key here"
          className=" focus:ring-[#1E90FF]"
        />
      </div>
    </CardContent>
    <CardFooter className="mt-6 flex justify-between text-sm text-gray-400">
    <span>© 2025 MAGE</span>
    <span>Create</span>
    </CardFooter>
  </Card>
</div>

</div>


  </div>
  
{/* <div  >
<h1 className="absolute left-[6%] md:left-[25%] bottom-[17%] md:bottom-[10%] text-xl font-semibold text-white z-10">Our Users</h1>

<div className="flex  flex-wrap justify-center gap-6  z-10">
  <div className="flex items-center gap-3">
    <img src="/1.png" alt="Image 1" className="md:w-12 md:h-12 w-10 h-10  object-cover rounded" />
    <p className="text-white  text-lg md:text-xl">Text 1</p>
  </div>

  <div className="flex items-center gap-3">
    <img src="/2.png" alt="Image 2" className="md:w-12 md:h-12 w-10 h-10 object-cover rounded" />
    <p className="text-white  text-lg md:text-xl">Text 2</p>
  </div>

  <div className="flex items-center gap-3">
    <img src="/3.png" alt="Image 3" className="md:w-12 md:h-12 w-10 h-10  object-cover rounded" />
    <p className="text-white  text-lg md:text-xl">Text 3</p>
  </div>

  <div className="flex items-center gap-3">
    <img src="/4.png" alt="Image 4" className="md:w-12 md:h-12 w-10 h-10  object-cover rounded" />
    <p className="text-white text-lg md:text-xl">Text 4</p>
  </div>
</div>
</div> */}
</section>

</AuroraBackground>





      {/* Infinite cards */}
      <VelocityScroll
      text="MAGE"
      default_velocity={5}
      className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
    />

<div className='flex flex-col lg:flex-row p-6 mt-10 text-gradient2 justify-around items-center ' >
  <span className=" text-4xl  font-bold" >This are all the platfroms</span>
    <IconCloud  iconSlugs={slugs} />
  <span className=" text-4xl  font-bold" >That  we Provide</span>
</div>

  {/* Title */}
  <h2 className="md:text-5xl mt-20 text-3xl font-bold text-white mb-8">Our Exclusive Services</h2>
  <div className="flex flex-col  px-6">
  {/* Row of 3 cards */}
  <div className="flex  flex-col md:flex-row gap-6 justify-between">
    {/* Card 1 */}
    <div
      className="w-full md:w-1/3 p-6 bg-black text-white rounded-3xl border-x-2 border-t-2 border-[#ff0080] shadow-md relative"
      style={{
        boxShadow: "inset 0 0 40px 1px #ff0080, inset 0 -2px 0 0 transparent",
      }}
    >
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
      <div className="absolute top-0 left-0 h-full w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -50px 20px 0px black", // inner bottom shadow
        }}></div>
      <h3 className="text-2xl font-semibold mb-4">Service One</h3>
      <div className="p-5 "  >
      <div className="space-y-2  mt-[4%] ">
        <Label htmlFor="name" className="text-sm font-medium">
          Input
        </Label>
        <Input
          id="name"
          placeholder="Type name here"
          className="bg-black w-full  focus:ring-[#1E90FF]"
        />
      </div>
      {/* Slider Section */}
      <div className="space-y-2 mt-[6%] ">
        <Label className="text-sm font-medium flex items-center justify-between">
          Temperature
          <span id="slider-value" className="text-sm font-bold text-gray-300">
            0.33
          </span>
        </Label>
        <Slider
          className="mt-2 "
          defaultValue={[0.33]}
          max={1}
          step={0.01}
          onValueChange={(value) => {
            const sliderValueElement = document.getElementById(
              "slider-value"
            ) as HTMLElement;
            if (sliderValueElement && value.length > 0) {
              sliderValueElement.textContent = value[0].toFixed(2);
            }
          }}
        />
      </div>
      <div className="mt-6 flex justify-between text-sm text-gray-400">
    <span>© 2025 MAGE</span>
    <span>Create</span>
    </div>
    <Button className="mt-6 w-[100px] border-2 border-white  " >
      Start
    </Button>
      </div>
    </div>

    {/* Card 2 */}
    <div
      className="w-full md:w-1/3 p-6 flex flex-col items-center justify-between bg-black text-white rounded-3xl border-x-2 border-t-2 border-[#00ffff] shadow-md relative"
      style={{
        boxShadow: "inset 0 0 40px 1px #00ffff, inset 0 -2px 0 0 transparent",
      }}
    >
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="absolute top-0 left-0 h-full w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -50px 20px 0px black", // inner bottom shadow
        }}></div>
      <h3 className="text-2xl mr-[30%] font-semibold mb-4">Service Two</h3>
    <div className="realtive h-max w-max ">
      <Compare
        firstImage="co1.png"
        secondImage="co2.png"
        firstImageClassName="object-cover w-max bg-black object-left-top"
        secondImageClassname="object-cover w-max bg-black object-left-top"
        className="h-[300px] w-[200px] "
        slideMode="hover"
      />
    </div>
    </div>

    {/* Card 3 */}
    <div
      className="w-full md:w-1/3 p-6 bg-black text-white rounded-3xl border-x-2 border-t-2 border-[#ffa500] shadow-md relative"
      style={{
        boxShadow: "inset 0 0 40px 1px #ffa500, inset 0 -2px 0 0 transparent",
      }}
    >
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="absolute top-0 left-0 h-full w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -50px 20px 0px black", // inner bottom shadow
        }}></div>
      <h3 className="text-2xl font-semibold mb-4">Service Three</h3>
      <div className="p-4 mt-[10%] flex flex-col justify-center items-center">
  <div className="relative">
    <button className="w-20 h-20 rounded-full royal-twilight border-[#ffa500] border-2 text-white flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 mr-[1rem] transform rotate-45"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 7l3 3m0 0l-3 3m3-3H10"
        />
      </svg>
    </button>
  </div>
  <p className="mt-4">
    Experience the future of personalization with your AI-powered assistant. From tailored financial advice to customized insurance options.
</p>

</div>

    </div>

    
  </div>
</div>


<h2 className="md:text-5xl mt-20 text-3xl font-bold text-white mb-8">Pricing Plans That Fit Your Right</h2>
  <div className="flex flex-col w-[100%] md:w-[70%]  px-6">
  {/* Row of 3 cards */}
  <div className="flex  flex-col md:flex-row gap-6 justify-between">
    {/* Card 1 */}
    <div
      className="w-full md:w-[50%] p-6 bg-black text-white rounded-3xl border-x-2 border-t-2 border-[#ffa500] shadow-md relative"
      style={{
        boxShadow: "inset 0 0 40px 1px #ffa500, inset 0 -2px 0 0 transparent",
      }}
    >
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="absolute top-0 left-0 h-[120%] w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -100px 20px 0px black", // inner bottom shadow
        }}></div>
<h3 className="text-2xl font-semibold mb-4">Free Plan</h3>
      <ul className="space-y-2 mt-6">
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Basic Chat Assistance</span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>10 Requests per Month</span>
        </li>
        <li className="flex items-center gap-2">
          <FaTimes  className="text-red-500" />
          <span>Custom Integrations</span>
        </li>
        <li className="flex items-center gap-2">
          <FaTimes  className="text-red-500" />
          <span>Priority Support</span>
        </li>
      </ul>
      <Button className="mt-[25%] w-full border-2 border-white">
        Get Started
      </Button>

    </div>



     <div
      className="w-full md:w-[60%] p-6 bg-black text-white rounded-3xl border-x-2 border-t-2 border-[#00ffff] shadow-md relative"
      style={{
        boxShadow: "inset 0 0 40px 1px #00ffff, inset 0 -2px 0 0 transparent",
      }}
    >
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
          <div className="absolute top-0 left-0 h-[120%] w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -100px 20px 0px black", // inner bottom shadow
        }}></div>
<h3 className="text-2xl font-semibold mb-4">Best for Price</h3>
      <ul className="space-y-2 mt-6">
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Advanced Chat Assistance</span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>100 Requests per Month</span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Custom Integrations</span>
        </li>
        <li className="flex items-center gap-2">
          <FaTimes  className="text-red-500" />
          <span>Priority Support</span>
        </li>
      </ul>
      <Button className="mt-[20%] w-full border-2 border-white">
        Subscribe for -/₹5999
      </Button>

    </div>


    {/* Card 3 */}
    <div
      className="w-full md:w-[50%] p-6 bg-black text-white rounded-3xl border-x-2 border-t-2 border-[#ffa500] shadow-md relative"
      style={{
        boxShadow: "inset 0 0 40px 1px #ffa500, inset 0 -2px 0 0 transparent",
      }}
    >
      <DotPattern
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
           <div className="absolute top-0 left-0 h-[120%] w-full z-[1] " 
        style={{
          boxShadow: "inset 0 -100px 20px 0px black", // inner bottom shadow
        }}></div>
 <h3 className="text-2xl font-semibold mb-4">Business Plan</h3>
      <ul className="space-y-2 mt-6">
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Premium Chat Assistance</span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Unlimited Requests</span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Custom Integrations</span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>Priority Support</span>
        </li>
      </ul>
      <Button className="mt-[25%] w-full border-2 border-white">
        Contact Sales
      </Button>

    </div>

    
  </div>
</div>
<BackdropGradient className='w-4/12 h-2/6 mt-[140px] z-[4] opacity-70' container="flex flex-col items-center">
<div className="flex flex-col md:flex-row items-center mt-20 w-[90%] justify-between p-4">
  <div className=" w-[100%] md:w-[60%] text-3xl">
  Experience the future of personalization with your AI-powered assistant. From tailored financial advice to customized insurance options, our intelligent bot learns about your unique needs, preferences, and goals to provide solutions that truly fit your life.
  </div>

  <div className="w-[100%] mt-[40px] md:mt-0 md:w-[35%]">
    <Image 
      src="/img.png" 
      alt="Description of image" 
      width={500} 
      height={300}
      objectFit="cover"
    />
  </div>
</div>
</BackdropGradient>

      <ProjectsSection />
      <Beam/>
        <HovCard/>
        <MarqueeDemo/>
      <Footer/>
    </main>
  );
}