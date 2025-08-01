import React, { useEffect, useState } from 'react';
import Header from '../../../home/components/Header/Header';
import Container from '../../../home/components/Layout/Container';
import Sidebar from '../../../sidebar/components/SideBarPage';
import Profile from '../../components/Profile/Profile';
import { useRouter } from 'next/router';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && typeof id === 'string') {
      setUserId(id);
    } else {
      // fallback: lấy userId từ localStorage nếu không có id trên URL
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('userInfo');
        const user = userData ? JSON.parse(userData) : null;
        if (user?._id) {
          setUserId(user._id);
        }
      }
    }
  }, [id]);

  if (!userId) return <div style={{ padding: 20 }}>Đang tải thông tin người dùng...</div>;

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Header />
      <main>
        <Container sidebar={<Sidebar activeTab={activeTab} onSelect={setActiveTab} />}>
          <Profile userId={userId} />
        </Container>
      </main>
    </div>
  );
};

export default ProfilePage;
