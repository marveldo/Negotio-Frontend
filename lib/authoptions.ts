import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { LoginGoogle } from "@/app/actions/auth";
import { CustomUser } from "@/types/next-auth";
import { Account } from "next-auth";
export const authOptions : NextAuthOptions = {
    providers : [  
        GoogleProvider({
           clientId : process.env.GOOGLE_CLIENT_ID as string,
           clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],

    callbacks : {
        
        async signIn({account}){
            if(account?.id_token){
                try {
                 const response = await LoginGoogle(account.id_token)
                 const data = response.data
                 
                 if(data.access){
                    
                    (account as any).custom = {
                      access: data.access,
                     refresh: data.refresh,
                     user: data.user
                        };
                    
                 }
                 return true
                }
                catch(error){
                    return false
                }
            }
            return true
        },

     

        async jwt({token , account}){
            if(account?.provider === 'google'){
                
                const CustomData = (account as any).custom
           
               
               return {
                  ...token,
                  access: CustomData.access,
                  refresh: CustomData.refresh,
                  user: CustomData.user
                };
            }
           return token
        },

        async session({token , session}){
            return {
                ...session ,
                access : token.access,
                refresh : token.refresh,
                user : token.user

            }
        }

    },
    session: {
        strategy: 'jwt',
      },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET, // Ensure this is set properly
      },
    pages : {
        signIn : '/',
        error : '/'
    }

}
