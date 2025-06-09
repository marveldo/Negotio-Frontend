"use client"
import React from "react";
import Image from "next/image";
import botimage from "@/public/Images/image 11.svg"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatsContext } from "@/app/components/chat/ChatContext";
import useWebSocket from "react-use-websocket";
import { GetChats } from "@/app/actions/createchatroom";
import {toast} from "sonner"
import { useSession } from "next-auth/react";

export interface Chats {
    type: string,
    message: string
}

function Animatedpulse() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <ellipse cx={12} cy={5} fill="currentColor" rx={4} ry={4}>
                <animate id="svgSpinnersBouncingBall0" fill="freeze" attributeName="cy" begin="0;svgSpinnersBouncingBall2.end" calcMode="spline" dur="0.919s" keySplines=".33,0,.66,.33" values="5;20"></animate>
                <animate attributeName="rx" begin="svgSpinnersBouncingBall0.end" calcMode="spline" dur="0.123s" keySplines=".33,0,.66,.33;.33,.66,.66,1" values="4;4.8;4"></animate>
                <animate attributeName="ry" begin="svgSpinnersBouncingBall0.end" calcMode="spline" dur="0.123s" keySplines=".33,0,.66,.33;.33,.66,.66,1" values="4;3;4"></animate>
                <animate id="svgSpinnersBouncingBall1" attributeName="cy" begin="svgSpinnersBouncingBall0.end" calcMode="spline" dur="0.061s" keySplines=".33,0,.66,.33" values="20;20.5"></animate>
                <animate id="svgSpinnersBouncingBall2" attributeName="cy" begin="svgSpinnersBouncingBall1.end" calcMode="spline" dur="0.98s" keySplines=".33,.66,.66,1" values="20.5;5"></animate>
            </ellipse>
        </svg>
    )
}

function Chatitself({ text, index }: { text: Chats, index: number }) {
    const {data : session , status} = useSession()
    return (
        <div key={index} className={`flex w-full ${text.type === 'chatbot' ? 'flex-row' : 'flex-row-reverse'} items-end gap-x-4`}>
            <div>
                {text.type === 'chatbot' ?
                    <Image src={botimage} alt="BotImage" />
                    :
                    <Avatar>
                        <AvatarImage src={session?.user.avatar_url} />
                        <AvatarFallback>GU</AvatarFallback>
                    </Avatar>
                }
            </div>
            {
                text.message === 'loading' ?
                    <div className="bg-purp text-white rounded-[8px] p-4">
                        <Animatedpulse />
                    </div> :
                    <div className="bg-purp text-white rounded-[8px] p-4 max-w-10/12">
                        {text.message}
                    </div>
            }
        </div>
    )
}

export default function ChatComponent({ params }: { params: Promise<{ id: string }> }) {
    const { chats, setchats , chatbarloading , setchatbarloading , setid } = useChatsContext();
    const { id } = React.use(params)
    

    
    // Proper WebSocket hook usage (moved out of connectwebsocket function)
   
    const { lastMessage } = useWebSocket(
        `wss://${process.env.NEXT_PUBLIC_BACKEND_HOST}/ws/chat/${id}/`,
        {
            onOpen: (event) => {
                console.log('WebSocket connection opened');
            },
            onError: (event) => {
                 toast.error("Wbsocket Error Detected", {
                         description:  'Refresh the page',
                         classNames: {
                           toast: '!bg-red-500',
                           title: '!text-white',
                           description: '!text-white'
                         }
                       }) ;
                 if(chatbarloading){
                    setchatbarloading(false)
                 }
            },
            shouldReconnect: (closeEvent) => true,
            reconnectInterval: 3000,
        }
    );
     
    React.useEffect(() => {
        if (lastMessage) {
            
            try {
                const data = JSON.parse(lastMessage.data);
                if (data.status !== 'Error') {
                    setchats(prev => {
                        if (!prev) return prev;
                        return prev.map(obj => 
                            obj.message === 'loading' 
                                ? { ...obj, message: data.message } 
                                : obj
                        );
                    });
                    setchatbarloading(false)
                    
                } else {
                    setchats(prev => {
                        if (!prev) return [];
                        const index = prev.findIndex(obj => obj.message === 'loading');
                        if (index === -1) return prev;
                        return [...prev.slice(0, index), ...prev.slice(index + 1)];
                    });
                    toast.error("Wbsocket Error Detected", {
                         description:  'Refresh the page',
                         classNames: {
                           toast: '!bg-red-500',
                           title: '!text-white',
                           description: '!text-white'
                         }
                       })
                    setchatbarloading(false)
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        }
    }, [lastMessage]);

    React.useEffect(()=> {
        const FetchFromBackend = async() => {
         try {
            const response= await GetChats(id)
            if(!chats) return 
            if (response.status === 200){
                
                if(response.data.length < chats.length && chatbarloading){
                   return 
                }
                else {
                    const Transformed_data : Chats[] = response.data.map((obj : any) => ({
                      type : obj.message_from,
                      message : obj.message
                    }))

                    if(chatbarloading){
                        setchatbarloading(false)
                    }

                    setchats(Transformed_data)
                }
            }
            else {
                
               toast.error("Error Fetching Messages", {
                         description:  'Failed to Fetch Messages',
                         classNames: {
                           toast: '!bg-red-500',
                           title: '!text-white',
                           description: '!text-white'
                         }
                       })
            }
         }
         catch(error){
           
                toast.error("Error Fetching Messages", {
                         description:  'Failed to Fetch Messages',
                         classNames: {
                           toast: '!bg-red-500',
                           title: '!text-white',
                           description: '!text-white'
                         }
                       })
         }
    }

    FetchFromBackend()
    }, [id])

    React.useEffect(()=> {
        setid(id)
    }, [])

    return (
        <div className="w-full flex flex-col-reverse overflow-y-scroll flex-1 gap-y-6 mt-auto">
            {chats?.map((obj, index) => (
                <Chatitself key={index} index={index} text={obj} />
            ))}
        </div>
    )
}
