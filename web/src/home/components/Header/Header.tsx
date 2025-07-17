import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

const Toolbar: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

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

  const onLogout = async () => {
    try {
      await axios.post('http://localhost:5000/v1/api/auth/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

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
            <div className={styles['dropdown']}>
              <div className={styles['dropdown-trigger']}>
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className={styles['avatar']}
                    />
                  )}
                  <span className={styles['user-name']}>{user.name}</span>
                </Link>
              </div>
              <div className={styles['dropdown-menu']}>
                <div className={styles['dropdown-profile']}>
                  <img src={user.avatar} alt="avatar" className={styles['avatar-large']} />
                  <div className={styles['profile-info']}>
                    <span className={styles['profile-name']}>
                      {user.name}
                      <svg className={styles['verified']} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 6, verticalAlign: 'middle' }}>
                        <circle cx="12" cy="12" r="10" fill="#2196f3" />
                        <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
                <ul className={styles['dropdown-list']}>
                  <li><SettingsIcon fontSize="small" style={{ marginRight: 8 }} />Account settings</li>
                  <li><LinkIcon fontSize="small" style={{ marginRight: 8 }} />Referral link</li>
                  <li><PersonIcon fontSize="small" style={{ marginRight: 8 }} />Profile settings</li>
                  <li><SwapHorizIcon fontSize="small" style={{ marginRight: 8 }} />Switch account</li>
                  <li><HelpOutlineIcon fontSize="small" style={{ marginRight: 8 }} />Help center</li>
                  <li><HistoryIcon fontSize="small" style={{ marginRight: 8 }} />Activity</li>
                </ul>
                <div onClick={onLogout} className={styles['logout-btn']}><LogoutIcon fontSize="small" style={{ marginRight: 8 }} /><span>Logout</span></div>
              </div>
            </div>
          ) : (
            <Link href="/login" passHref>
              <button className={styles['login-btn']}>Login</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
