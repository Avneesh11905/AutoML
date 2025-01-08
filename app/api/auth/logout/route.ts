import { cookies } from "next/headers";

export async function GET() {
  try{
  cookies().set("token", '' ,{httpOnly: true});
  return new Response(JSON.stringify({msg : 'Logged out successfully'}),{
    headers: {"Content-Type": "application/json"},    
    status : 200,
  })
  }catch(error){
    return new Response(JSON.stringify({msg : error instanceof Error?error.message:'Unknown error'}),{
      headers: {"Content-Type": "application/json"},    
      status : 500,
    })
  }
}
  
