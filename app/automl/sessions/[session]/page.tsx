'use client'
import { Flex, Loader, ScrollArea} from "@mantine/core"
import { Tabs } from '@mantine/core';
import { useContext, useEffect, useState } from "react";
import { TableContext } from "@/components/contexts/TableContext";
import styles from './styles/Demo.module.css'
import TableDisplay from "@/components/TableDisplay";
import { DeleteSessionButton } from "@/components/session/DeleteSessionButton";


const Page = ({ params }: { params: { session: string }; }) => {
  const tableContext = useContext(TableContext);
  const session = params.session;
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadSession = async () => {
      const res = await fetch('/api/auth');
      const userData = await res.json();
      setUsername(userData.username);
      const rspns = await fetch(`/api/py/load-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          session: session
        })
      });
      const data = await rspns.json();
      tableContext?.setOriginalTableData(data.original);
      tableContext?.setCurrentTableData(data.current);
      setIsLoaded(true);
    }
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[session]);
  

  return (
    <Flex h='92vh' w='100%' justify='center' align='center'>
      {isLoaded &&
      <Tabs h='100%' w='100%' defaultValue="Data Display" orientation="vertical" classNames={{ tab: styles.tab }}>

        <Tabs.List >
        <Flex justify='space-between' h='100%' className="flex-col">
          <Tabs.Tab value="Data Display" >
            Data Display
          </Tabs.Tab>
          <Tabs.Tab value="Data Manipulation">
            Data Manipulation
          </Tabs.Tab>
          <Tabs.Tab value="Model training">
            Model training
          </Tabs.Tab>
          <Tabs.Tab value="Freeze Model">
            Freeze Model
          </Tabs.Tab>
          <DeleteSessionButton session={session} username={username!}/>
        </Flex>
        </Tabs.List>
        

        <Tabs.Panel value="Data Display">
          <Flex justify='center' align='center' h={'100%'}>
            <ScrollArea h='100%' w='100%'>
              <Flex align='center' justify='start' p='xl' gap='xl' mih='92vh' className="flex-col">
                <TableDisplay tableData={tableContext?.originalTableData} title="Original Data"/>
              </Flex>
            </ScrollArea>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="Data Manipulation">
          <Flex justify='center' align='center' h={'100%'} className="flex-col">
            <ScrollArea h='100%' w='100%'>
              <Flex justify='center' align='center' p='xl' gap='xl' mih='92vh' className="flex-col">
                EHHE
              </Flex>
            </ScrollArea>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="Model training">
          <Flex justify='center' align='center' h={'100%'} className="flex-col">
            <ScrollArea h='100%' w='100%'>
              <Flex justify='center' align='center' p='xl' gap='xl' mih='92vh' className="flex-col">
                Model Training
              </Flex>
            </ScrollArea>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="Freeze Model">
        <Flex justify='center' align='center' h={'100%'} className="flex-col">
            <ScrollArea h='100%' w='100%'>
              <Flex justify='center' align='center' p='xl' gap='xl' mih='92vh' className="flex-col">
                Freeze Model
              </Flex>
            </ScrollArea>
          </Flex>
        </Tabs.Panel>
      </Tabs>
    }
    {
      !isLoaded &&
      <Loader size={50}/>
    }
    </Flex>
    
  )
}

export default Page