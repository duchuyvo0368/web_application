import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
       const res= await axios.get('http://localhost:5000/v1/api/auth/profile', {
            withCredentials: true,
          });
        if (res.data) {
          router.replace(redirect?.toString() || '/'); 
        } else {
          setAuthChecked(true);
        }
      } catch (err) {
        setAuthChecked(true); 
      }
    };

    checkAuth();
  }, [redirect, router]);

  const handleLoginSuccess = () => {
    router.push(redirect?.toString() || '/');
  };

  if (!authChecked) return null; // chỉ render khi xác thực xong

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
