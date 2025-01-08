'use client'
import FormBg from '@/components/FormBg';
import { Button, Flex, Group, TextInput , PasswordInput, LoadingOverlay, Progress } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  if (password.length < 5) {
    return 10;
  }

  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function getStrengthColor(strength: number) {
  switch (true) {
    case strength < 25:
      return 'red';
    case strength < 50:
      return 'orange';
    case strength < 75:
      return 'yellow';
    default:
      return 'teal';
  }
}

export default function Demo() {
  const [value, setValue] = useState('');
  const strength = getStrength(value);
  const color = getStrengthColor(strength);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      username: '',
      passwd: '',
      repasswd: '',
    },
    validate: { 
      username: (value) => (value.length < 3 ? 'Invalid Username' : null),

    },
 
  });
  
  useEffect(() => {
    setValue(form.values.passwd);

  },[form.values])
  
  const handelSubmit = async (val: typeof form.values) => {
    setIsSubmitting(true);
    if(strength<75){
      form.setFieldError('repasswd', 'Password is too weak');
      setIsSubmitting(false);
      return
    }
    const response = await fetch(`/api/py/signup`,{
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
      console.log(user)
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

    <FormBg title='Sign Up'>
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
        <Group grow gap={5} mt="xs">
        <Progress size="xs" color={color} transitionDuration={0} value={value.length > 0 ? 100 : 0} />
        <Progress size="xs" color={color} transitionDuration={0} value={strength < 30 ? 0 : 100} />
        <Progress size="xs" color={color} transitionDuration={0} value={strength < 50 ? 0 : 100} />
        <Progress size="xs" color={color} transitionDuration={0} value={strength < 70 ? 0 : 100} />
      </Group>
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
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
        
    </form>
    </FormBg>
        </Flex>
  );
}