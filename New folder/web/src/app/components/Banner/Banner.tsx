import React from 'react';
import Image from 'next/image';
import RightSidebar from '@/app/home/components/Home/RightSidebar/RightSidebar';

const Banner: React.FC = () => {
  return (
      <div className="flex">
          {/* Phần bên trái: nội dung chính */}
          <div className="flex-1 pl-6">
              {/* Banner thu gọn chiều rộng */}
              <div className="w-full justify-center items-center shadow-md mb-2 overflow-hidden rounded-lg">
                  <Image
                      src="/slider.png"
                      alt="Banner"
                      width={1200}
                      height={300}
                      className="w-full h-24 object-cover"
                      priority
                  />
              </div>

              {/* Nội dung khác */}
          </div>

         
      </div>

  );
};

export default Banner;
