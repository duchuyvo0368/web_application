/* eslint-disable @next/next/no-img-element */
import React from 'react';

const RightSidebar: React.FC = () => (
  <div className="sticky top-[73px] w-[260px] h-full bg-white  overflow-y-auto">
    <div className=" h-[100px] overflow-hidden">
      <img
        src="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp"
        alt="Sidebar content"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);


export default RightSidebar;
