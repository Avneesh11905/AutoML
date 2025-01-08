import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  
  const token = cookies().get("token");
  if(!token){
    console.log('no token')
    return new Response(JSON.stringify({msg : false}), {
      headers: {
        "Content-Type": "application/json",
      },
        status : 401,
    })
  }
  try{
    const val = jwt.verify(token.value, process.env.JWT_SECRET!);
    return new Response(JSON.stringify( val ),{
      headers: {"Content-Type": "application/json"},
      status : 200,
    });
  }catch(error){
    console.log( error instanceof Error?error.message:'unkown error' )
    return new Response(JSON.stringify({msg : false}), {
      headers: {"Content-Type": "application/json"},    
      status : 401,
    });
  }
}
  
