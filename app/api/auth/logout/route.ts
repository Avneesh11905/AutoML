import { cookies } from "next/headers";

export async function GET(request: Request) {
  try{
  cookies().set("token", '' ,{httpOnly: true});
  return new Response(JSON.stringify({msg : 'Logged out successfully'}),{
    headers: {
      "Content-Type": "application/json",
    },    
    status : 200,
  })
  }catch(error){
    return new Response(JSON.stringify({msg : 'Unknown error'}),{
      headers: {
        "Content-Type": "application/json",
      },    
      status : 500,
    })
  }
}
  
