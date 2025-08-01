/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Banner from '@/app/components/Banner/Banner';
import Container from '@/app/components/Container/Container';
import FriendGrid from '@/app/friends/components/Friend';
import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/SideBar/SideBar';
import TabBar from '@/app/components/TabBar/TabBar';
import React, { useState } from 'react';

const tabTypeMap = ['friends', 'suggestions', 'request', 'following', 'sent'];

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [actionSideBar, setActiveSideBar] = useState(0);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Header />
      <main>
        <Container sidebar={<Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />}>
          <Banner />
          <TabBar activeTab={activeTab} onSelect={setActiveTab} />
          <FriendGrid type={tabTypeMap[activeTab] as any} />
        </Container>
      </main>
    </div>
  );
};

export default FriendsPage;
