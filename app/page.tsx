'use client'
import { Button, Flex } from '@mantine/core'
import GoodBg from '../components/GoodBg'
import { useRouter } from 'next/navigation'


const Page = () => {

  const router = useRouter();

  const handelClick = async () =>{
    const response = await fetch('/api/auth',{
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      const data = await response.json();
      router.push(`/automl`);
    }else{
      const data = await response.json();
      router.push('/login');
    }
    
  } 
  
  return (
    <Flex className="h-[100vh] w-full justify-center items-center" >
      <GoodBg>
        <Button onClick={handelClick}>Get Started</Button>
      </GoodBg>
    </Flex>
  )
}

export default Page