'use server';

import { auth } from '@/auth';
import { User } from 'next-auth';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await auth();

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
