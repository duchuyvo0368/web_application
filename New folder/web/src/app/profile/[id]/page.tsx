/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Banner from '@/app/components/Banner/Banner';
import Container from '@/app/components/Container/Container';
import FriendGrid from '@/app/friends/components/Friend';
import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/SideBar/SideBar';
import TabBar from '@/app/components/TabBar/TabBar';
import React, { useState } from 'react';
import RightSidebar from '@/app/home/components/Home/RightSidebar/RightSidebar';
import ProfilePage from '@/app/user/components/Profile/Profile';
export default function Profile() {
    const [activeTab, setActiveTab] = useState(0);
    const [actionSideBar, setActiveSideBar] = useState(0);

    return (
        <div style={{ overflowX: 'hidden' }}>
            <Header />
            <main>
                <Container sidebar={<Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />}>
                  
                    <div className="flex gap-2 ">
                        {/* Bên trái là profile */}
                        <div className="flex-1 w-[1200px] overflow-y-auto max-h-screen">
                            <ProfilePage />
                        </div>

                        {/* Bên phải là RightSidebar */}
                        <div className="w-[260px] pt-1 border-l border-gray-200 scrollbar-hide">
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                        </div>
                    </div>
                  
                </Container>

            </main>
        </div>
    );
};

  


