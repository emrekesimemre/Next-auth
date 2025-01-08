'use server';

import { createAuthSession } from '@/lib/auth';
import { hashUserPassword } from '@/lib/hash';
import { createUser } from '@/lib/user';
import { redirect } from 'next/navigation';

export async function signup(prevState, formData) {
  console.log('🚀 ~ file: auth-actions.js:4 ~ signup ~ prevState:', prevState);
  const email = formData.get('email');
  const password = formData.get('password');

  let errors = {};

  if (!email.includes('@')) {
    errors.email = 'Email must contain @';
  } else if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    const id = createUser(email, hashedPassword);
    console.log('🚀 ~ file: auth-actions.js:29 ~ signup ~ id', id)
    await createAuthSession(id);
    redirect('/training');
  } catch (error) {
    if(error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'Email already in use'
        }
      }
    }
    throw error
  }
}
