/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Home from '@/app/home/components/Home/Home';
import RightSidebar from '@/app/home/components/Home/RightSidebar/RightSidebar';
import Banner from '@/app/components/Banner/Banner';
import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/SideBar/SideBar';
import React, { useState } from 'react';

const HomePage: React.FC = () => {
    const [actionSideBar, setActiveSideBar] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 ">
            <Header />

            <main className="flex ">
                {/* Sidebar trái */}
                <div className="hidden xl:block w-72 border-r border-gray-200 bg-white shadow-sm">
                    <Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 h-full pt-2 overflow-y-auto px-2 md:px-4 scrollbar-hide">

                    <div className="max-w-2xl mx-auto">
                        <Banner />
                        <Home />
                    </div>
                </div>

                {/* RightSidebar phải */}
                <div className="hidden xl:flex xl:flex-col xl:w-[260px] xl:h-screen h-[calc(100vh-80px)] xl:overflow-y-auto border-l border-gray-200 shadow-md bg-white">
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250618/674d883a-df87-45f2-b6bf-0f4718cf894e--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20241226/9741bec3-34f6-468a-b7d5-713fcc036c2d--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                    <RightSidebar imageUrl="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" />
                </div>
            </main>
        </div>
    );
};

export default HomePage;
