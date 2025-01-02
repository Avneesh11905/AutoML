'use client'
import { Button, Card, FileButton, Flex, Group, Table } from "@mantine/core"
import { Tabs } from '@mantine/core';
import { useContext, useEffect, useState } from "react";
import { TableContext } from "@/components/contexts/TableContext";
import { MIME_TYPES } from "@mantine/dropzone";
import { useRouter } from "next/navigation";

const Page = ({ params, }: { params: { session: string }; }) => {
  const router = useRouter();
  const tableContext = useContext(TableContext);
  const session = params.session;
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const res = await fetch('/api/auth', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const response = await fetch('/api/py/check-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            session: params.session
          })
        });
        if (response.ok) {
          
        }
        else {
          router.push('/automl/create-session');
        }
      }
    }
    verifySession();

  }, [])

  
  return (
    <Flex justify='center' align='center' h='100vh' w='100vw'>
      <Flex className='space-x-4' >
        <Tabs defaultValue="Upload" orientation="vertical">
          <Tabs.List grow>
            <Tabs.Tab value="Upload" >
              Upload
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
          </Tabs.List>

          <Tabs.Panel value="Upload">
            <Flex justify='center' align='center' mih='70vh' miw='40vw' className="flex-col">
              
              {isUploaded &&
                <Card shadow='sm' radius='md' padding="lg" miw='17vw' className='space-y-4' withBorder >
                  <Table.ScrollContainer minWidth={500}>
                    <Table data={tableContext?.tableData} striped withTableBorder withColumnBorders />
                  </Table.ScrollContainer>
                </Card>
              }
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="Data Manipulation">
            <Flex justify='center' align='center' h='70vh' w='40vw' className="flex-col">
              Data Manipulation
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="Model training">
            <Flex justify='center' align='center' h='70vh' w='40vw' className="flex-col">
              Model training
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="Freeze Model">
            <Flex justify='center' align='center' h='70vh' w='40vw' className="flex-col">
              Freeze Model content
            </Flex>
          </Tabs.Panel>
        </Tabs>
      </Flex>
    </Flex>
  )
}

export default Page