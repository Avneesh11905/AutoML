'use client'
import { Button, Card, Flex } from '@mantine/core'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  
  return (
   <Flex justify='center' align='center' h='92vh' w='100%'>
    <Card shadow='lg' radius='md' m='1vw' w='15vw' className='space-y-3'> 
      <Button onClick={() => router.push('/automl/create-session')}>Create new Session</Button>
      <Button onClick={() => router.push('/automl/sessions')}>Use Existing Session</Button>
    </Card>
   </Flex>
  )
}

export default Page