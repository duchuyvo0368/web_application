import React, { useEffect, useState } from 'react';
import Header from '../../home/components/Header/Header';
import Container from '../../home/components/Layout/Container';
import Sidebar from '../../sidebar/components/SideBarPage';
import Profile from '../components/Profile/Profile';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Đảm bảo đang ở client
    const userData = localStorage.getItem('userInfo');
    const user = userData ? JSON.parse(userData) : null;
    if (user?._id) {
      setUserId(user._id);
    }
  }, []);

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
