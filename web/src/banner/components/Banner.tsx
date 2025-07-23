/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './Banner.module.css';

// Banner width 1180px, căn giữa, ảnh phủ kín vùng banner
const FriendsBanner: React.FC = () => (
  <div className={styles.bannerWrapper}>
    <img
      src="/images/slider.png"
      alt="Carnival Party Banner"
      className={styles.bannerImg}
    />
  </div>
);

export default FriendsBanner; 