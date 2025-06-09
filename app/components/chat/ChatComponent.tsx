import React from "react";
import { SidebarProvider , 
         SidebarTrigger , 
        } from "@/components/ui/sidebar";
import { SidebarComponent } from "./SidebarComponent";
import menubar from "@/public/Images/menubar.svg"
import Image from "next/image";
import ChatInputBar from "./Chatbar";
import { ChatsProvider, Rooms } from "./ChatContext";

import axios from "axios"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import {  Getrooms } from "@/app/actions/createchatroom";

export async function HomepageLayout ({children} : Readonly<{children : React.ReactNode}>){
     
      const session = await getServerSession(authOptions)
      let data = []
      let status = 200
      if(session?.access){
        const events = await Getrooms(session.access)
        data = events.data
        status = events.status
      }
     
      
      return (
           <SidebarProvider popover="auto" defaultOpen={true}>  
             <ChatsProvider initialState={data} status_code={status}>
               <SidebarComponent/> 
             <div className="w-full h-screen sm:pt-12 px-8 pt-12 pb-6 relative flex flex-col gap-y-12 overflow-hidden ">
               <div className="absolute  left-0 bottom-0 h-[12rem] z-30 w-[12rem] rounded-full bg-radial blur-3xl from-purp to-black opacity-30  ">h</div>
               <div className="absolute right-0 h-[12rem]  w-[12rem] z-30 rounded-full bg-radial blur-3xl from-purp to-black opacity-30  ">h</div>
               <div className="absolute right-0 h-[12rem] z-30 bottom-0 w-[12rem] rounded-full bg-radial blur-3xl from-purp to-black opacity-30  ">h</div>
               
                <div className="w-full flex flex-row justify-between">
                <h1 className="text-[28px] max-[768px]:hidden font-bold tracking-tighter bg-clip-text bg-gradient-to-r from-black to-purp text-transparent">Negotio</h1>
                <SidebarTrigger className="min-[768px]:hidden"/>
                <Image src={menubar} alt="menubar"/>
                
                </div>
                
                {children}
             
             <ChatInputBar/>
                
             </div>
           </ChatsProvider>
           </SidebarProvider>
        
      )
}


