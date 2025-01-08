'use client';
import { Button, Flex } from "@mantine/core";
import { useRouter } from "next/navigation";


const LogOutButton = () => {
  const router = useRouter();
  const handelLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      router.push('/login');
    }
  }

  return (
    <Flex bg='cyan' gap={40} justify='center'>
      <Button w='100px' h='8vh' color='grape' onClick={() => router.push('/automl/sessions')}>Sessions</Button>
      <Button w='100px' h='8vh' color='grape' onClick={handelLogout}>LogOut</Button>
    </Flex>
  )
}

export default LogOutButton