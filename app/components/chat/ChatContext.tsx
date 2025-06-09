"use client"
import React, { Dispatch, SetStateAction } from "react"
import { Chats } from "@/app/chat/[id]/page"
import { signOut } from "next-auth/react"
import { useSearchParams , useRouter } from "next/navigation";
import { toast } from "sonner";

export interface Rooms {

   id : string ,
   room_name : string ,

}

interface ChatContexttype {

    chats : Chats[] | null,
    setchats : Dispatch<SetStateAction<Chats[]|null>>,
    rooms : Rooms[] | null,
    setrooms : Dispatch<SetStateAction<Rooms[]|null>>,
    chatbarloading : boolean,
    setchatbarloading : Dispatch<SetStateAction<boolean>>,
    id : string | null ,
    setid : Dispatch<SetStateAction<string | null>>
}

const ChatroomsContext = React.createContext<ChatContexttype>({
    chats : [],
    setchats : ()=> {},
    rooms : null ,
    setrooms : () => {},
    chatbarloading : false,
    setchatbarloading : () => {},
    id : null ,
    setid : () => {}
})


export function ChatsProvider ({children , initialState = [] , status_code = 200} : {children : React.ReactNode , initialState? : Rooms[] , status_code : number}){
    const [chats , setchats] = React.useState<Chats[] | null>([])
    const [rooms , setrooms] = React.useState<Rooms[] | null>(initialState)
    const [chatbarloading , setchatbarloading] = React.useState<boolean>(false)
    const [id , setid] = React.useState<string | null>(null)
    
    const params = useSearchParams()
    const error = params.get('error')
    const router = useRouter()
     

    if(status_code === 500){
        toast.error('Error Getting Chats History', {
            description : 'Refresh the page',
             classNames: {
                        toast: '!bg-red-500',
                        title: '!text-white',
                        description: '!text-white'
             }
        })
    }
    else if(status_code === 401){
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
    React.useEffect(() => {
        const rooms_from_localstroage : Rooms[] = localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms') as string) : []
        if (rooms_from_localstroage.length > 0  ){
            const new_rooms : Rooms[] = rooms ? [...rooms , ...rooms_from_localstroage] : [...rooms_from_localstroage] 
            setrooms(new_rooms)
        }
    }, [])

    React.useEffect(()=> {
         if(error){
        toast.error('Google Authentication Failed', {
                   description : 'Try agin later',
                    classNames: {
                               toast: '!bg-red-500',
                               title: '!text-white',
                               description: '!text-white'
                    }
               })
         router.replace('/')
      }
    }, [])
    return (
        <ChatroomsContext.Provider value={{chats , rooms , setchats , setrooms , chatbarloading , setchatbarloading , id , setid}}>
            {children}
        </ChatroomsContext.Provider>
    )
}

export const useChatsContext = () => React.useContext(ChatroomsContext)