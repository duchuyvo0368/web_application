import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginForm from '../components/LoginForm';
import { isAuthenticated } from '../services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(redirect?.toString() || '/');
    } else {
      setAuthChecked(true);
    }
  }, [redirect, router]);

  const handleLoginSuccess = () => {
    router.push(redirect?.toString() || '/');
  };

  if (!authChecked) return null;

  return (
    <>
      <Head>
        <title>Đăng nhập</title>
        <meta name="description" content="Đăng nhập vào tài khoản của bạn" />
      </Head>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1de9b6 0%, #1dc8e9 100%)'
        }}
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          redirectTo={redirect?.toString() || '/'}
        />
      </div>
    </>
  );
}