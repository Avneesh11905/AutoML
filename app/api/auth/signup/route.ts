import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try{  
    const response = await request.json();
    const newUser = {username:response.username};
    const token = jwt.sign(newUser, process.env.JWT_SECRET!,{ expiresIn: '2d' });
    cookies().set("token", token ,{httpOnly: true});
    return new Response(JSON.stringify({msg : 'success'}), {
      headers: {"Content-Type": "application/json"},
      status : 201,
    });
  }catch(error){
    console.log( error )
    return new Response(JSON.stringify({msg : error instanceof Error? error.message:'unkown error'}), {
      headers: {"Content-Type": "application/json"},    
      status : 400,
    });
  }
}
  
