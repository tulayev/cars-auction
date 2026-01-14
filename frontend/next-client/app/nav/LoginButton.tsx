'use client';

import { Button } from 'flowbite-react';
import { signIn } from 'next-auth/react';

export default function () {
  return (
    <Button
      onClick={() => signIn('id-server', {redirectTo: '/'}, {prompt: 'login'})}
      outline
    >
      Login
    </Button>
  )
}
