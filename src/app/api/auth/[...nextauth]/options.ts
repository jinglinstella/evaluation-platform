import type { NextAuthOptions} from "next-auth"
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials"

import User from "src/app/models/user"
import NextAuth from "next-auth/next"
import bcrypt from "bcryptjs"

export const options: NextAuthOptions={
    providers: [
        GithubProvider({

            clientId: process.env.GITHUB_ID as string, 
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name:"credentials",
            credentials:{
                email: {
                    label: "Email:",
                    type:"text",
                    placeholder:"your-cool-username"
                },
                password: {
                    label: "Password:",
                    type:"password",
                    placeholder:"your-password"
                }
            },
            async authorize(credentials){
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                const { email, password } = credentials!;

                try{
                    const user=await User.findOne({email});
                    if(!user){
                        return null;
                    }
    
                    const passwordMatch=await bcrypt.compare(password, user.password);
    
                    if(!password){
                        return null;
                    }
    
                    return user;
                }catch(error){
                    console.log("Error: ", error);
                }
            }
        })
    ],
    session:{
        strategy:"jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/",
    },
}