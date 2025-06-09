"use server"
import { authOptions } from "@/lib/authoptions"
import axios from "axios"
import { getServerSession } from "next-auth"


export const CreateRoom = async(message : string) => {
    const session = await getServerSession(authOptions)
    if(session?.access){
    try {
       const response = await axios.post(`${process.env.BACKEND_URL}/chat/user-owned-room`,{room_name : message.slice(0,30)}, {
         headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${session.access}`
         }
       })
       return {
        status : 200,
        data : response.data.obj
       }
    }
    catch(error : any){
        return error.response ? {
            status : error.response?.status
        } : {
            status : 500
        }
    }
    }
    try {
       const response = await axios.post(`${process.env.BACKEND_URL}/chat/`, {room_name : message.slice(0,30)})
       return {
        status : 200,
        data : response.data.obj
       }
    }
    catch(error : any){
        return error.response ? {
            status : error.response?.status
        } : {
            status : 500
        }
    }
}

export const CreateChat = async(message : string, id :string) => {

    try{
        
       const response = await axios.post(`${process.env.BACKEND_URL}/chat/${id}`, {message : message})
       return {
        status : 200,
        data : { 
            type : response.data.obj.message_from,
            message : response.data.obj.message
        }
       }
    }
    catch(error : any){
        return error.response ? {
            status : error.response?.status
        } : {
            status : 500
        }
    }
}

export const GetChats = async(id : string) => {
       try {
        const response = await axios.get(`${process.env.BACKEND_URL}/chat/${id}`)
        return {
            status : 200,
            data : response.data.obj
        }
       }catch(error : any){
           return error.response ? {
            status : error.response?.status
        } : {
            status : 500
        }
       }
}

export const Getrooms = async(access : string) => {
   
    try {
        
        const response = await axios.get(`${process.env.BACKEND_URL}/chat/rooms/` , {
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access}`
            }
        })
       
        return {
            status : 200,
            data : response.data.obj
        }

    }
    catch(error : any){
        return error.response ? {
            status : error.response?.status,
            data : []
        } : {
            status : 500,
            data : []
        }
    }
}