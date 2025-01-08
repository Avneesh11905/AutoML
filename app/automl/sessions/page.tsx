'use client'
import { DeleteSessionButton } from "@/components/session/DeleteSessionButton";
import { Card, Flex, Progress, Text, Title } from "@mantine/core"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Sessions = {
  session: string;
  filename: string;
  progress: number;
};

const Page = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [sessionsData, setSessionsData] = useState<Sessions[] | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const getSessions = async () => {
      const res = await fetch('/api/auth');
      const userData = await res.json();
      setUsername(userData.username)
      const response = await fetch(`/api/py/get-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username
        })
      })
      const data = await response.json();
      setSessionsData(data);
      setIsLoaded(true);
    }
    getSessions();
  }, [])

  const sessionCards = sessionsData?.map((sessionData, index) => {
    return (
      <Card key={index} shadow='lg' radius='md' m='1vw' miw='18vw' maw='18vw' h='18vh' className="hover:cursor-pointer" onClick={() => router.push(`/automl/sessions/${sessionData.session}`)} withBorder >
        <Card.Section m='sm'>
          <Title size="h4">{decodeURIComponent(sessionData.session)}</Title>
          <Text size="sm" color='dimmed'>Filename : {sessionData.filename}</Text>
          <DeleteSessionButton session={sessionData.session} username={username!}/>
        </Card.Section>
        <Progress value={sessionData.progress} size='sm' color='blue' />
      </Card>
    )
  })

  return (
    <>
      {isLoaded &&

        <Flex className="w-[100vw] justify-center" >
          <Flex className="pt-[4vh] w-[80vw] flex-wrap"  >
            {sessionCards}
            <Card shadow='lg' radius='md' m='1vw' miw='18vw' h='18vh' withBorder className="hover:cursor-pointer flex justify-center items-center" onClick={() => router.push(`/automl/create-session`)}  >
              <Title size="h4">
                Create New Session
              </Title>
            </Card>
          </Flex>
        </Flex>
      }
    </>
  )
}

export default Page