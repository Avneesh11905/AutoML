'use client'
import GoodBg from '@/components/GoodBg';
import { Button, Flex, Group, TextInput , PasswordInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



export default function Demo() {
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRegex = /^(?=\S)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      passwd: '',
      repasswd: '',

    },
    validate: { 
      username: (value) => (value.length < 3 ? 'Invalid Username' : null),
      passwd: (value) => ((!passwordRegex.test(value) )? 'Invalid Password' : null),
      repasswd: (value) => ((!passwordRegex.test(value))? 'Invalid Password' : null),

    },
 
  });
  
  
  const handelSubmit = async (val: typeof form.values) => {
    setIsSubmitting(true);
    const response = await fetch('/api/py/signup',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(val),
    });
    if(response.ok){
      const userdata = await response.json();
      const res = await fetch('/api/auth/signup',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      });
      const token = await res.json();
      const user =  {username: userdata.username,
                     token:token} ;
      router.push('/automl');
    }else{
      const data = await response.json();
      if(data.msg == 'Passwords do not match'){
        
        form.setFieldError('repasswd', data.msg);
        
        console.log(form.errors);
      } 
      if(data.msg == 'Username not available'){
        
        form.setFieldError('username', data.msg);
        
        console.log(form.errors);
      } 
    }
    setIsSubmitting(false);
  }

  return (
    <Flex className="h-[100vh] w-full justify-center items-center" >

    <GoodBg>
      <LoadingOverlay visible={isSubmitting} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
    <form className='space-y-4' onSubmit={form.onSubmit(handelSubmit)}>
      <TextInput
        placeholder="Username"
        key={form.key('username')}
        {...form.getInputProps('username')}
        />
      <PasswordInput
        placeholder="Password"
        key={form.key('passwd')}
        {...form.getInputProps('passwd')}
        />
      <Flex className='flex-col'>
      <PasswordInput
        placeholder="Re-Enter Password"
        key={form.key('repasswd')}
        {...form.getInputProps('repasswd')}
        />
      <Flex w='100%' className='justify-end'>
        <span className='text-sm'>Already have an account?
          <Link href='/login' className='underline text-blue-500'> Login</Link>
        </span>
      </Flex>
      </Flex>
      <Group w='100%' mt="md">
        <Button type="submit" className='w-[100%]'>Submit</Button>
      </Group>
        
    </form>
    </GoodBg>
        </Flex>
  );
}