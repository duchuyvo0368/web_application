import React from 'react';
import Image from 'next/image';

const Banner: React.FC = () => {
  return (
    <div className=" shadow-md mb-3 overflow-hidden">
      <Image
        src="/slider.png" // Đảm bảo ảnh nằm tại public/images/banner/1.jpg
        alt="Banner"
        width={1000}
        height={200}
        className="w-full h-34 object-cover"
        priority
      />
    </div>
  );
};

export default Banner;
