/* eslint-disable @next/next/no-img-element */
import React from 'react';

// Banner width 1180px, căn giữa, ảnh phủ kín vùng banner
const FriendsBanner: React.FC = () => (
  <div className="w-full h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 2xl:h-64 overflow-hidden mb-1.5">
    <img
      src="/images/slider.png"
      alt="Carnival Party Banner"
      className="w-full h-full object-cover"
    />
  </div>
);

export default FriendsBanner; 