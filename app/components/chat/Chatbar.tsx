"use client"
import React from "react";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import {toast} from "sonner"
import { usePathname , useRouter } from "next/navigation";
import { useChatsContext } from "./ChatContext";
import { CreateRoom , CreateChat } from "@/app/actions/createchatroom";
import { signOut , useSession } from "next-auth/react";

export const Spinner = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1.4rem" viewBox="0 0 24 24"><g stroke="black"><circle cx={12} cy={12} r={9.5} fill="none" strokeLinecap="round" strokeWidth={3}><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.95s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"></animate><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.95s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59"></animate></circle><animateTransform attributeName="transform" dur="2.6s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></g></svg>
    )
}

export default function ChatInputBar () {
    const [chatmessage , setchatmessage] = React.useState('')
    const [loading , setloading] = React.useState<boolean>(false)
    const router = usePathname()
    const path = useRouter()
    const {data:session} = useSession()
    const { 
      rooms , 
      setrooms , 
      setchats , 
      chatbarloading , 
      setchatbarloading,
      id
    } = useChatsContext()

    const changeInput = ( e : React.ChangeEvent<HTMLInputElement>) => {
       const {value} = e.target
       setchatmessage(value)
    }

   const handlehomechatbarlogic = async (message: string) => {
  if (!rooms) return;

  try {
    setloading(true);
    const items = localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms') as string) : [];
    const serveractionres = await CreateRoom(message);
   
    if (serveractionres.status === 200) {
      
      const newRoom = {
        id: serveractionres.data.id,
        room_name: serveractionres.data.room_name
      };
      
      const new_items = [newRoom, ...rooms];
      if(!session?.access){
         localStorage.setItem('rooms', JSON.stringify([newRoom, ...items]));
      }
     
      path.push(`/chat/${serveractionres.data.id}`);
      
     
  
      setrooms(new_items);

      setchats([
        { type: 'chatbot', message: 'loading' },
        { type: 'user', message: chatmessage }
      ]);
      
      setchatbarloading(true);
      
      
     
      const serveraction2 = await CreateChat(message, serveractionres.data.id);
  
      if (serveraction2.status === 500) {
        toast.error("Error Sending message", {
          description:  'Failed to send message',
          classNames: {
            toast: '!bg-red-500',
            title: '!text-white',
            description: '!text-white'
          }
        });
        return 
      }
      

    } 
    else if (serveractionres.status === 200){
          toast.error('Token Expired', {
               description : 'Log in Again',
                classNames: {
                           toast: '!bg-red-500',
                           title: '!text-white',
                           description: '!text-white'
                }
           })
           signOut({callbackUrl : '/'})
    }
    else {
      toast.error("Error creating room", {
        description:  'Failed to create room',
        classNames: {
          toast: '!bg-red-500',
          title: '!text-white',
          description: '!text-white'
        }
      });
    }
  } catch (error) {
    console.error("Error in handlehomechatbarlogic:", error);
    toast.error("Error creating room", {
        description:  'Failed to create room',
        classNames: {
          toast: '!bg-red-500',
          title: '!text-white',
          description: '!text-white'
        }
      });
  } finally {
    setloading(false);
    setchatmessage('')
  }
};

const handlecharbarlogicchatroute = async(message : string) => {
    if(!id) return 
      try {
        setloading(true)
        const response = await CreateChat(message , id)
        if(response.status === 500){
           toast.error("Error Sending message", {
          description:  'Failed to send message',
          classNames: {
            toast: '!bg-red-500',
            title: '!text-white',
            description: '!text-white'
          }
        });
        return
      }
        
        setchatbarloading(true)
        setchats(prev => {
          if (!prev) return []
          const new_list = [   { type: 'chatbot', message: 'loading' },
                           { type: 'user', message: chatmessage } , ...prev]
          return new_list
           })
      }
      catch(error){
           toast.error("Error Sending message", {
          description:  'Failed to send message',
          classNames: {
            toast: '!bg-red-500',
            title: '!text-white',
            description: '!text-white'
          }
          });
           console.log(error)
      }
      finally{
        setloading(false)
        setchatmessage('')
      }
}

    const Sendtobackend = async(message : string) => {
        
        
        if(router === '/'){
            setloading(true)
            handlehomechatbarlogic(message)            
          }
        else if (router.startsWith('/chat')) {
          handlecharbarlogicchatroute(message)
        }
    }
    const onclick = () => {
        if(chatmessage === ''){
           toast("Error Sending message",
            {
            description : 'Message is Empty',
            classNames : {
                toast : '!bg-red-500',
                title : '!text-white',
                description : '!text-white'
            }
            
           }
           )
        }
        else{
          Sendtobackend(chatmessage)
            
        }
    }
    return(
        
        <div className=" w-full min-h-[65px] rounded-3xl bg-opacegreylight z-50 relative animate__animated animate__zoomIn" >
            <Input 
            className="h-full border-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white "
            placeholder="Enter Your Prompt"
            onChange={changeInput}
            value={chatmessage}
            disabled={loading || chatbarloading}
            />
            <div 
            className={`absolute right-1.5 top-1.5 p-3 rounded-full bg-purp hover:brightness-50 hover:cursor-pointer ${loading || chatbarloading ? 'brightness-50' : '' }`} 
            onClick={onclick}
            >
               {loading ? <Spinner/> : <ArrowRight className="size-7 text-white"/> }
            </div>
        </div>
    )
}