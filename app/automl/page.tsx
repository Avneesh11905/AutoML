'use client'
import GoodBg from '@/components/GoodBg'
import { Button, Flex } from '@mantine/core'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  return (
   <Flex justify='center' align='center' h='100vh' w='100vw'>
      <GoodBg>
        <Button onClick={() => router.push('/automl/create-session')}>Create new Session</Button>
        <Button onClick={() => router.push('/automl/existing')}>Use Existing</Button>
      </GoodBg>
   </Flex>
  )
}

export default Page