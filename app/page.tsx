import React from "react";
import Vector from "@/public/Images/Group 47244.svg"
import Image from "next/image"


export default function Home() {
  return (
    <div className="w-full flex flex-1 flex-col gap-y-20 items-center animate__animated animate__backInUp" >
      <div className="relative">
          <div className="absolute h-[12rem] z-30 w-[12rem] rounded-full bg-radial blur-3xl from-purp to-black opacity-30  ">h</div>
        <Image height={54.58} width={41} className="max-[1200px]:hidden" src={Vector} alt="Logo"/>
         <h1 className="text-[28px] min-[1200px]:hidden font-bold tracking-tighter bg-clip-text bg-gradient-to-r from-black to-purp text-transparent">Negotio</h1>
      </div>
      <div className="flex flex-col text-center items-center gap-y-10">
      <p className="font-inter text-[32px] text-black">How can we <span className="bg-clip-text bg-gradient-to-r font-bold from-black to-purp text-transparent">assist</span> you today?</p>
      <div className="max-w-md mx-auto px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
         <p className="text-center text-sm sm:text-base md:text-lg leading-relaxed">
        Get expert guidance powered by AI agents specializing in Sales, Marketing, and Negotiation. Choose the agent that suits your needs and start your conversation with ease.
        </p>
      </div>

      </div>
      
      
      
    </div>
  );
}
