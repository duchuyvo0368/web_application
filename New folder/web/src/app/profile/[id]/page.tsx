/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Banner from '@/app/components/Banner/Banner';
import Container from '@/app/components/Container/Container';
import FriendGrid from '@/app/friends/components/Friend';
import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/SideBar/SideBar';
import TabBar from '@/app/components/TabBar/TabBar';
import React, { useState } from 'react';
import RightSidebar from '@/app/home/components/RightSidebar/RightSidebar';
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
                        <div className="flex-1 w-[1200px] overflow-y-auto max-h-screen scrollbar-hide">
                            <ProfilePage />
                        </div>

                        {/* Bên phải là RightSidebar */}
                        <div className="hidden xl:flex xl:flex-col xl:w-[260px] xl:h-screen h-[calc(100vh-80px)] xl:overflow-y-auto border-l border-gray-200 shadow-md bg-white">
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp" />
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp" />
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                            <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                        </div>
                    </div>

                </Container>

            </main>
        </div>
    );
};




