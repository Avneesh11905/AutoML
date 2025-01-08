import { ActionIcon } from '@mantine/core'
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react'
export const DeleteSessionButton = ({session,username}:{session:string,username:string}) => {
    const router = useRouter();
    const openModal = async () => modals.openConfirmModal({
        title: 'Please confirm your action',
        centered: true,
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: async() => {
            await fetch(`/api/py/delete-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    session: session
                })
            });
            router.push(`/automl/sessions`);
        },
    });

  return (
    <ActionIcon color='red' size={60} onClick={openModal}>
        <IconTrash></IconTrash>
    </ActionIcon>
  )
}
