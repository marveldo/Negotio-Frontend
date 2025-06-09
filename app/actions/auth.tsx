import axios from "axios";


export const LoginGoogle = async(token : string) => {
    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/users/auth/google/`, {id_token : token})
        return {
            status : 200 ,
            data : response.data
        }
     }
     catch (error : any){
        return error.response ? {
            status : error.response?.status
        } : {
            status : 500
        }
     }

}