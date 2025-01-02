'use client'

import GoodBg from "@/components/GoodBg"
import { Button, Flex, Group, LoadingOverlay, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            session: '',
        },
        validate: {
            session: (value) => (value.length < 3 ? 'Invalid Username' : null),
        },
    });

    const handelSubmit = async (value: typeof form.values) => {
        setIsSubmitting(true);
        const res = await fetch('/api/auth', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(res.ok){
            const data = await res.json();
            const response = await fetch('/api/py/check-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    session: value.session
                })
            });
            if(response.ok){
                form.setFieldError('session', 'Session Name not Available');
            }
            else{
                router.push(`/automl/create-session/${value.session}`);
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

                        placeholder="Session name"
                        key={form.key('session')}
                        {...form.getInputProps('session')}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>

            </GoodBg>
        </Flex>
    )
}

export default Page