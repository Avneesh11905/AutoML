'use client'
import FormBg from "@/components/FormBg"
import { Button, Flex, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            session: '',
        },
        validate: {
            session: (value) => ( value.charAt(0)!==value.charAt(0).toUpperCase() ? 'First Letter Should Be Capital' : null),
        },
    });

    const handelSubmit = async (value: typeof form.values) => {
        setIsSubmitted(true);
        const res = await fetch('/api/auth');
        const userData = await res.json();
        const response = await fetch(`/api/py/check-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                session: encodeURIComponent(value.session)
            })
        });
        if(response.ok){
            form.setFieldError('session', 'Session Name not Available');
        }else{
            router.push(`/automl/create-session/${value.session}`);
        }          
        setIsSubmitted(false);
      } 

    return (
        <>
        {!isSubmitted &&
            
            <Flex className="h-[92vh] w-full justify-center items-center" >
            <FormBg title="Create New Session">
            <form className='space-y-4' onSubmit={form.onSubmit(handelSubmit)}>
            <TextInput
            placeholder="Session name"
            key={form.key('session')}
            {...form.getInputProps('session')}
            />
            <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
            </Group>
            </form>
            
            </FormBg>
            </Flex>
        }
        </>
        )
}

export default Page