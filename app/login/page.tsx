'use client'
import FormBg from '@/components/FormBg';
import { Button, Flex, Group, TextInput , PasswordInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



export default function Demo() {
  const router = useRouter();    
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      passwd: '',
    },
    validate: { 
      username: (value) => (value.length < 3 ? 'Invalid Username' : null),
      passwd: (value) => (value.length < 1 ? 'Password can\'t be empty' : null),
    },
  });
  
  const handelSubmit = async (value: typeof form.values) => {
    setIsSubmitting(true);
    const response = await fetch(`/api/py/login`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    
    if(response.ok){
      const data = await response.json();
      const res = await fetch('/api/auth/login',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok){
        const data = await res.json();
        console.log(data)
        router.push('/automl');  
      }else{
        const data = await res.json();
        form.setFieldError('passwd', data.msg);
      }
    }
    else{  
      const data = await response.json();
      form.setFieldError('username', data.msg); 
      form.setFieldError('passwd', data.msg);  
    }
    setIsSubmitting(false);
  }

  return (
    <Flex className="h-[100vh] w-full justify-center items-center" >
    <FormBg title='Login'>
    <LoadingOverlay visible={isSubmitting} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
    <form className='space-y-4' onSubmit={form.onSubmit(handelSubmit)}>
      <TextInput
        
        placeholder="Username"
        key={form.key('username')}
        {...form.getInputProps('username')}
        />
      <Flex className='flex-col'>
        <PasswordInput
          placeholder="Password"
          key={form.key('passwd')}
          {...form.getInputProps('passwd')}
          />
      <Flex w='100%' className='justify-end'>
        <span className='text-sm'>Create Account? 
          <Link href='/signup' className='underline text-blue-500'> SignUp</Link>
        </span>
      </Flex>
      </Flex>

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>

    </FormBg>
        </Flex>
  );
}