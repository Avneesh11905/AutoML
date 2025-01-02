import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(req : NextRequest) {
  if (req.nextUrl.pathname === '/automl' || req.nextUrl.pathname.startsWith('/automl/')){
    const token = req.cookies.get("token");

    if(!token){
      console.log('no token')
      return NextResponse.redirect(new URL("/", req.url));
    }
    try{
      await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!));
      console.log('verified');
      return NextResponse.next();
    }catch(error){
      console.error("Token verification failed:", error instanceof Error?error.message:'unkown error');
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'){
     const token = req.cookies.get("token");
    
     if(!token){
      console.log('no token')
      return NextResponse.next();
    }
    try{
      await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!));
      console.log('verified');
      return NextResponse.redirect(new URL("/automl", req.url));
    }  
    catch(error){
      console.error("Token verification failed:", error instanceof Error?error.message:'unkown error');
      return NextResponse.next();
    }  
  }
  }

