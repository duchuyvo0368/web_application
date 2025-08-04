/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Home from '@/app/home/components/Home/Home';
import RightSidebar from '@/app/home/components/Home/RightSidebar/RightSidebar';
import Banner from '@/app/components/Banner/Banner';
import Container from '@/app/components/Container/Container';

import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/SideBar/SideBar';
import React, { useState } from 'react';


const HomePage: React.FC = () => {
  const [actionSideBar, setActiveSideBar] = useState(0);

  return (
    <div >
      <Header />
      <main>
        <Container sidebar={<Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />}>
          <Banner />
          <Home/>
        </Container> 
      </main>
     
    </div>
  );
};

export default HomePage;
