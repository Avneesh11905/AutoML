import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try{
  const userdata = await request.json();
  const token = jwt.sign(userdata, process.env.JWT_SECRET!,{ expiresIn: '2d'});
  cookies().set("token", token ,{httpOnly: true});
  return new Response(JSON.stringify({msg : 'Logged in successfully'}),{
    headers: {"Content-Type": "application/json",},    
    status : 200,
  })
  }catch(error){
    return new Response(JSON.stringify({msg : error instanceof Error?error.message:'Internal Server Error'}),{
      headers: {"Content-Type": "application/json",},    
      status : 500,
    })
  }
}
  
