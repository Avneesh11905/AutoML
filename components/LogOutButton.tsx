'use client';
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";


const LogOutButton= () => {
  const router = useRouter();
  const handelLogout = async () => {
    const response = await fetch('/api/auth/logout',{
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      router.push('/login');
    }
  }

  return (
   
    <Button pos='relative' w='100px' onClick={handelLogout}>LogOut</Button>
      
  )
}

export default LogOutButton