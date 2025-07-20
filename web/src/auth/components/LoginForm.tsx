/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/auth.service';
import styles from './loginForm.module.css';

interface LoginFormProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectTo = '/' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setError('');
        setIsLoading(true);

        await login({
            data: { email, password },
            onSuccess: (res) => {
                const accessToken = res?.metadata?.tokens?.accessToken;
                const refreshToken = res?.metadata?.tokens?.refreshToken;
                const user = res?.metadata?.user;
                console.log('Access Token:', accessToken);

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    setTimeout(() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('userInfo');
                        console.log('Access token đã hết hạn và bị xoá.');
                        
                    }, 15 * 60 * 1000);
                    if (user) {
                        localStorage.setItem('userInfo', JSON.stringify(user));
                        console.log('đẩy user vào localstorage để Header tự cập nhật')
                    }
                } else {
                    console.error('Không tìm thấy accessToken trong response');
                }

                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push(redirectTo);
                }
            },
            onError: (err) => {
                setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            },
        });




        setIsLoading(false);
    };

    return (
        <div className={styles.loginBg}>
            <div className={styles.loginContainer}>
                <h2 className={styles.loginTitle}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.loginField}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className={styles.loginField}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <div className={styles.loginError}>{error}</div>}
                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm; 