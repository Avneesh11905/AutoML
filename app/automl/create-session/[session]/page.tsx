'use client'
import { TableContext } from '@/components/contexts/TableContext';
import { Button, FileButton, Flex, Group, Table } from '@mantine/core';
import { MIME_TYPES } from '@mantine/dropzone';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const Page = ({ params, }: { params: { session: string }; }) => {
  const session = params.session;
  const router = useRouter();
  const tableContext = useContext(TableContext);
  const [isUploaded, setIsUploaded] = useState(false);
  const [ufile , setFile] = useState<File | string>('');
  const [username , setUsername] = useState<string>('');

  useEffect(() => {
    console.log('Session changed:', params.session);
    const verifySession = async () => {
      const res = await fetch('/api/auth', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        const response = await fetch('/api/py/check-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            session: session
          })
        });
        if (response.ok) {
          router.push(`/automl/${session}`);
        }
        else {
        }
      }
    }
    verifySession();
  }, [])

  const handleSubmit = async (file: File | null) => {
    if (!file) {
      return;
    }
    setFile(file);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/py/get-display-data-for-new-session', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      tableContext?.setTableData(data);
      setIsUploaded(true);
    }
  }

  const handleDrop = () => {
    tableContext?.setTableData(undefined);
    setIsUploaded(false);
  }
  
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('session', session);
    formData.append('file', ufile);
    const res = await fetch('/api/py/save-session', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/automl/${session}`);  
    }
    else{
      const data = await res.json();
      console.log(data);
    }
  }
  return (
    <Flex justify='center' align='center' h='100vh' w='100vw'>
      {!isUploaded &&
        <Group justify="center">
          <FileButton onChange={handleSubmit} accept={`${MIME_TYPES.csv},${MIME_TYPES.xlsx},${MIME_TYPES.xls}`}>
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </Group>
      }
      {isUploaded &&
        <Group justify='center'>
          <Table data={tableContext?.tableData}></Table>
          <Flex className='flex' justify='center' align='center' gap={40}>
            <Button color='red' onClick={handleDrop}>Drop Dataset</Button>
            <Button color='blue' onClick={handleSave}>Save Dataset to Session</Button>
            
          </Flex>
        </Group>
      }
    </Flex>
  )
}

export default Page