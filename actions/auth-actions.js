'use server';

import { createAuthSession, destroySession } from '@/lib/auth';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';
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
    console.log('🚀 ~ file: auth-actions.js:29 ~ signup ~ id', id);
    await createAuthSession(id);
    redirect('/training');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'Email already in use',
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  console.log('🚀 ~ file: auth-actions.js:46 ~ signup ~ prevState:', prevState);
  const email = formData.get('email');
  const password = formData.get('password');

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: {
        email: 'Invalid email or password',
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: 'Invalid email or password',
      },
    };
  }
  await createAuthSession(existingUser.id);
  redirect('/training');
}

export async function auth(mode, prevState, formData) {
  if (mode === 'login') {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect('/');
}
