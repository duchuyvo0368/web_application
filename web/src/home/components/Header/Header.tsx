/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import axios from 'axios';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}


const Toolbar: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
 
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await axios.get('http://localhost:5000/v1/api/users/profile', {
            withCredentials: true, 
          });
        setUser(res.data.metadata.user);
        } catch (err) {
          setUser(null);
        }
      };
      fetchUser();
    }, []);
  return (
    <header className={styles.toolbar}>
      <div className={styles['toolbar-container']}>
        <div className={styles['toolbar-left']}>
          <button className={styles['menu-btn']} aria-label="Open menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          </button>
          <div className={styles.weather}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" fill="#b3e5fc" /><path d="M17 17.5a5 5 0 0 0-10 0" stroke="#90caf9" /></svg>
            <div className={styles['weather-info']}>
              <span className={styles.city}>Hanoi, <span className={styles.temp}>19.03°C</span></span>
              <span className={styles.desc}>mây cụm</span>
            </div>
          </div>
        </div>
        <div className={styles['toolbar-right']}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user.avatar && (
                <img src={user.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              )}
              <span>{user.name}</span>
            </div>
          ) : (
            <Link href="/login" passHref>
              <button className={styles['login-btn']}>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Toolbar; 