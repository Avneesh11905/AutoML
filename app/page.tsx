'use client'
import { Button, Card, Flex } from '@mantine/core'
import { useRouter } from 'next/navigation'


const Page = () => {

  const router = useRouter();

  const handelClick = async () =>{
    router.push('/login')    
  } 
  
  return (
    <Flex className="h-[100vh] w-full justify-center items-center" >
      <Card shadow='lg' radius='md' m='1vw' w='15vw' >
        <Button onClick={handelClick}>Get Started</Button>
      </Card>
    </Flex>
  )
}

export default Page