import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(req : NextRequest) {
  
  let username : string = '';
  
  const verifyToken = async () => {
    const token = req.cookies.get("token");
    if(!token){
      console.log('no token')
      return false;
    }
    try{
      const val = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!));
      username = val.payload.username!.toString();
      return true;
    }catch(error){
      console.error("Token verification failed:", error instanceof Error?error.message:'unkown error');
      return false;
    }
  }

  const verifySession = async (sessionName: string) => {
    const response = await fetch(`http://localhost:8000/api/py/check-session`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: username ,
        session: sessionName
      })
    });
    if (response.ok) {
      return true
    }
    else{
      console.log('session not found')
      return false
    }
  }
  
  if (req.nextUrl.pathname === '/automl' || req.nextUrl.pathname.startsWith('/automl/create-session') || req.nextUrl.pathname.startsWith('/automl/sessions')){
    const isTokenValid = await verifyToken();
    if(!isTokenValid){
      return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log('token valid')
    if (req.nextUrl.pathname.startsWith('/automl/create-session/')){
      const doesSessionExist = await verifySession(req.nextUrl.pathname.split('/')[3]);
      if (doesSessionExist){
        console.log('session exists')
        return NextResponse.redirect(new URL("/automl/sessions", req.url));
      }
    }
    if (req.nextUrl.pathname.startsWith('/automl/sessions/')){
      const doesSessionExist = await verifySession(req.nextUrl.pathname.split('/')[3]);
      if (!doesSessionExist){
        console.log('session exists')
        return NextResponse.redirect(new URL("/automl/sessions", req.url));
      }
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'){
    const isTokenValid = await verifyToken();
    if(!isTokenValid){
      return NextResponse.next(); 
    }
    console.log('valid')
    return NextResponse.redirect(new URL("/automl", req.url));
  }
 
}

