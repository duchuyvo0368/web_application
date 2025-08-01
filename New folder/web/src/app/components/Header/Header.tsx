/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  Settings as SettingsIcon,
  Link as LinkIcon,
  Person as PersonIcon,
  SwapHoriz as SwapHorizIcon,
  HelpOutline as HelpOutlineIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { getAuthHeaders } from '@/utils/index'; // nếu bạn có

interface User {
  _id: string;
  name: string;
  avatar?: string;
  email?: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('userInfo');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  const onLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/v1/api/auth/logout',
        {},
        { headers: getAuthHeaders() }
      );
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="bg-white shadow-md py-2 px-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button className="p-2" aria-label="Open menu">
            {/* icon menu */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          {/* weather */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" fill="#b3e5fc" />
              <path d="M17 17.5a5 5 0 0 0-10 0" stroke="#90caf9" />
            </svg>
            <div>
              <span className="font-medium">Hanoi, <span className="text-[#4fc3f7]">19.03°C</span></span>
              <div className="text-xs text-gray-400">mây cụm</div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          {user ? (
           <div className="relative group">
  {/* Trigger: Avatar và tên */}
  <div className="flex items-center gap-2 cursor-pointer">
    <Link href={`/profile/${user._id}`} className="flex items-center gap-2">
      {user.avatar && (
        <img
          src={user.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover shadow-sm hover:ring-2 hover:ring-blue-300 transition"
        />
      )}
      <span className="font-medium text-gray-800 hover:text-blue-600 transition">{user.name}</span>
    </Link>
  </div>

  {/* Dropdown */}
  <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
    <div className="flex items-center gap-3 px-4 py-3 border-b">
      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover shadow" />
      <div>
        <span className="font-medium text-sm text-gray-800 flex items-center gap-1">
          {user.name}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#2196f3" />
            <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <ul className="text-sm text-gray-700 divide-y divide-gray-100">
      <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
        <SettingsIcon fontSize="small" className="text-blue-500" />
        Account settings
      </li>
      <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
        <LinkIcon fontSize="small" className="text-blue-500" />
        Referral link
      </li>
      <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
        <PersonIcon fontSize="small" className="text-blue-500" />
        Profile settings
      </li>
      <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
        <SwapHorizIcon fontSize="small" className="text-blue-500" />
        Switch account
      </li>
      <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
        <HelpOutlineIcon fontSize="small" className="text-blue-500" />
        Help center
      </li>
      <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer">
        <HistoryIcon fontSize="small" className="text-blue-500" />
        Activity
      </li>
    </ul>

    <div
      onClick={onLogout}
      className="px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer text-sm transition"
    >
      <LogoutIcon fontSize="small" className="text-red-500" />
      <span>Logout</span>
    </div>
  </div>
</div>


          ) : (
            <Link href="/login">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
            </Link>
          )}
        </div>
      </div>
    </header>

  );
};

export default Header;
