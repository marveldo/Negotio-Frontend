"use client"
import {  Sidebar , 
         SidebarContent , 
         SidebarFooter , 
         SidebarGroup , 
         SidebarHeader ,
         SidebarGroupLabel,
         useSidebar
         
         } from "@/components/ui/sidebar";
import Image from "next/image";
import icon1 from "@/public/Images/Group 47239.svg"
import icon2 from "@/public/Images/Vector.svg"
import chaticon from "@/public/Images/Chatvector.svg"
import { PlusIcon , SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChatsContext , Rooms  } from "./ChatContext";
import React from "react";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useSession , signIn, signOut} from "next-auth/react";
import google from "@/public/Images/devicon_google.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


function ChatComponent ({room} : {room : Rooms}) {
  const path = usePathname()
  return (
    <Link
      href={path.startsWith("/chat") ? `${room.id}` : `chat/${room.id}`}
      className="flex flex-row bg-secgreylight sm:p-3 p-3 rounded-[8px] justify-between items-center hover:brightness-50"
    >
      <Image src={chaticon} alt="Message" />
      <p className="text-white min-[768px]:text-[1rem] text-[0.5rem] ">
        {room.room_name.slice(0, 14)}....
      </p>
      <Image src={icon2} className="opacity-0" alt="Vector" />
    </Link>
  );
}

function LogoutIcon() {
  return(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            className="text-white size-7 transition-all duration-300 hover:translate-y-2 hover:cursor-pointer"
          >
            <path
              fill="currentColor"
              d="M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5zm16 7l-4-4v3H9v2h8v3z"
            ></path>
          </svg>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure You want to Logout ??</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={()=>{signOut({callbackUrl : '/'})}}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
   
  );
}



export function SidebarComponent (){
  const { rooms } = useChatsContext();
  const { data: session, status } = useSession();
  const [google_loading, google_loading_Transistion] = React.useTransition();
 
 
  let room_divs: React.JSX.Element[] | React.JSX.Element;

  if (rooms) {
    if (rooms.length > 0) {
      room_divs = rooms.map((obj, index) => {
        return <ChatComponent key={index} room={obj} />;
      });
    } else {
      room_divs = (
        <div className="p-3 text-center text-white">
          <p>No recent Chats</p>
        </div>
      );
    }
  } else {
    room_divs = (
      <div className="p-3 text-center text-white">
        <p>No recent Chats</p>
      </div>
    );
  }

  const HandleGoogleLogin = async () => {
    google_loading_Transistion(async () => {
      await signIn("google", {
        callbackUrl: "/",
      });
    });
  };

  return (
    <Sidebar className="gap-y-6">
      <SidebarHeader className="bg-black pt-12 px-8 pb-6">
        <div className="w-full flex justify-between">
          <Image src={icon1} alt="NavIcon" />
          <Image src={icon2} alt="Vector" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-6 bg-black overflow-hidden relative">
        <div className="absolute left-[-200px] h-[70vh]  w-[45vh] rounded-full bg-radial blur-3xl from-purp to-black opacity-70  ">
          h
        </div>

        <SidebarGroup className="">
          <Link
            href="/"
            className="flex p-4 justify-between items-center  bg-sec rounded-[8px] hover:brightness-50"
          >
            <p className="font-inter min-[768px]:text-[1rem] text-[0.5rem]  text-white ">
              Begin a new chat
            </p>
            <PlusIcon className="min-[1025px]:size-4 size-3 text-white " />
          </Link>
        </SidebarGroup>

        <SidebarGroup className="scrollable-container">
          <div className="flex flex-col  gap-y-5 md:px-4 md:py-6 p-3 bg-bat rounded-[8px] ">
            <div className="flex w-full md:h-[48px]h-[35px] bg-secgrey items-center sm:p-3 px-3 rounded-[8px]">
              <SearchIcon className="md:size-6 size-3  text-white " />
              <Input
                className="border-0 h-full italic bg-secgrey md:text-[9px] placeholder:text-[9px] focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search for a chat ...."
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="font-inter text-white text-[15px]">
                Recent Chats
              </h1>
              <div className="flex flex-col gap-y-6">{room_divs}</div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black px-8 pb-6">
        {status === "authenticated" ? (
          <div className="w-full flex flex-row items-center justify-between gap-x-2 bg-sec rounded-[8px] md:px-4 md:py-6 p-3">
            <Avatar>
              <AvatarImage src={session.user.avatar_url} />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <p className="font-inter min-[786px]:text-[1rem] text-[0.5rem]  text-white">
              {session.user.email}
            </p>
           <LogoutIcon/>
          </div>
        ) : (
          <div
            className={`w-full flex flex-row items-center justify-center gap-x-2 bg-sec rounded-[8px] md:px-4 md:py-6 p-3 hover:brightness-50 ${
              google_loading ? "brightness-50" : ""
            } hover:cursor-pointer`}
            aria-disabled={google_loading}
            onClick={HandleGoogleLogin}
          >
            <Image src={google} alt="google picture" />
            <p className="font-inter min-[1025px]:text-[1rem] text-[0.5rem]  text-white">
              Sign In with Google
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
