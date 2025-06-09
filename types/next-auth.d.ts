import NextAuth,{DefaultSession,} from "next-auth";
import { JWT } from "next-auth/jwt";

export interface CustomUser {
    email : string ,
    avatar_url : string
}
declare module "next-auth"{
    interface Session {
        access : string ,
        refresh : string,
        user : CustomUser
    }

    interface User {
       access : string ,
       refresh : string,
       user : CustomUser
    }
}

declare module "next-auth/jwt"{
    interface JWT {
       access : string ,
       refresh : string,
       user : CustomUser
    }
}

