import User from "src/app/models/user";
import { NextResponse } from "next/server";

export async function post(req: any){
    try{
        const {name, email, password} = req.json();
        const user = User.findOne({email}).select("_id");
        console.log("user: ", user);
        return NextResponse.json({user});
    }catch(error){
        console.log(error);
    }
}