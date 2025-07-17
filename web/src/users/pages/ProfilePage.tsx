import React, { useState } from 'react';
import Header from '../../home/components/Header/Header';
import Container from '../../home/components/Layout/Container';
import Sidebar from '../../sidebar/components/SideBarPage';
import Banner from '../../banner/components/Banner';
import Profile from '../components/Profile/Profile';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Header />
      <main>
        <Container sidebar={<Sidebar activeTab={activeTab} onSelect={setActiveTab} />}>
          {/* <Banner /> */}
          <Profile user={{
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            email: 'john.doe@example.com',
          }} />
        </Container>
      </main>
    </div>
  );
};

export default ProfilePage; 