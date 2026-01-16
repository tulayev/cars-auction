'use client';

import { deleteAuction } from '@/app/actions';
import { Button, Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
  id: string;
}

export default function DeleteButton({id}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  function handleDelete() {
    setLoading(true);
    
    deleteAuction(id)
      .then(reponse => {
        if (reponse.error) {
          throw reponse.error;
        }

        router.push('/');
      })
      .catch(error => {
        console.error(error);
        toast.error(`${error.status} ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <Button
      color="red"
      onClick={() => handleDelete}
      outline
    >
      {loading && <Spinner size="sm" className="mr-3" />}
      Delete auction
    </Button>
  )
}
