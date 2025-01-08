'use client'
import { TableType } from '@/components/contexts/TableContext';
import TableDisplay from '@/components/TableDisplay';
import { Button, FileButton, Flex, Group} from '@mantine/core';
import { MIME_TYPES } from '@mantine/dropzone';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const Page = ({ params, }: { params: { session: string } }) => {
  const session =  params.session;
  const router = useRouter();
  const [tableData, setTableData] = useState<TableType | undefined>(undefined);
  const [isUploaded, setIsUploaded] = useState(false);
  const [ufile , setFile] = useState<File | null>(null);

  const handleSubmit = async (file: File | null) => {
    if (!file) {
      return;
    }
    setFile(file);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/py/get-display-data-for-new-session`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setTableData(data);
      setIsUploaded(true);
    }
  }

  const handleDrop = () => {
    setTableData(undefined);
    setIsUploaded(false);
  }
  
  const handleSave = async () => {
    const response = await fetch('/api/auth');
    const userData = await response.json();
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('session', session);
    formData.append('file', ufile!);
    const res = await fetch(`/api/py/save-new-session`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      router.push(`/automl/sessions/${session}`);  
    }
    else{
      const data = await res.json();
      console.log(data);
    }
  }

  return (
    <Flex justify='center' align='center' h='92vh' w='100vw'>
      {!isUploaded &&
        <Group justify="center">
          <FileButton onChange={handleSubmit} accept={`${MIME_TYPES.csv},${MIME_TYPES.xlsx},${MIME_TYPES.xls}`}>
            {(props) => <Button {...props}>Upload DataFile</Button>}
          </FileButton>
        </Group>
      }
      {isUploaded &&
        <Flex className='flex-col'> 
          <TableDisplay tableData={tableData} title={ufile?.name}></TableDisplay>
          <Flex justify='center' align='center' gap='35vw'>
            <Button color='red' onClick={handleDrop}>Drop Dataset</Button>
            <Button color='blue' onClick={handleSave}>Create Session</Button>
          </Flex>
        </Flex>
      }
    </Flex>
  )
}

export default Page 