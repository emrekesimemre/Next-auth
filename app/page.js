import AuthForm from '@/components/auth-form';

export default async function Home({ searchParams }) {
  console.log('🚀 ~ file: page.js:4 ~ Home ~ searchParams:', searchParams);
  const formMode = searchParams.mode || 'login';
  return <AuthForm mode={formMode} />;
}
