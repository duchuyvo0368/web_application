import React from 'react';
import styles from './HomePage.module.css';
import Toolbar from '../components/Header/Header';
import FriendsContainer from '../components/Layout/Container';
import FriendsSidebar from '../components/Sidebar/Sidebar';
import FriendsBanner from '../../banner/components/Banner';
import FriendsHeader from '../../friends/components/Header/Header';
import FriendsGrid from '../../friends/components/Grid/Grid';

const friends = [
  { name: 'Quốc Thụy', img: 'https://randomuser.me/api/portraits/men/1.jpg',    mutual: '0 mutual friends', followers: '1.2K followers' },
  { name: 'Minh Khôi', img: 'https://randomuser.me/api/portraits/men/2.jpg',    mutual: '3 mutual friends', followers: '856 followers' },
  { name: 'Thành Đạt', img: 'https://randomuser.me/api/portraits/men/3.jpg',    mutual: '5 mutual friends', followers: '2.3K followers' },
  { name: 'Ngọc Bích', img: 'https://randomuser.me/api/portraits/women/1.jpg',   mutual: '2 mutual friends', followers: '1.5K followers' },
  { name: 'Hải Yến', img: 'https://randomuser.me/api/portraits/women/2.jpg',     mutual: '7 mutual friends', followers: '3.1K followers' },
  { name: 'Quang Huy', img: 'https://randomuser.me/api/portraits/men/4.jpg',     mutual: '1 mutual friend', followers: '987 followers' },
  { name: 'Thảo Nguyên', img: 'https://randomuser.me/api/portraits/women/3.jpg', mutual: '4 mutual friends', followers: '1.7K followers' },
  { name: 'Bảo An', img: 'https://randomuser.me/api/portraits/men/5.jpg',         mutual: '0 mutual friends', followers: '542 followers' },
  { name: 'Tuấn Kiệt', img: 'https://randomuser.me/api/portraits/men/6.jpg',       mutual: '2 mutual friends', followers: '1.9K followers' },
  { name: 'Kim Liên', img: 'https://randomuser.me/api/portraits/women/4.jpg',    mutual: '6 mutual friends', followers: '2.5K followers' },
  { name: 'Đức Minh', img: 'https://randomuser.me/api/portraits/men/7.jpg',      mutual: '3 mutual friends', followers: '1.1K followers' },
  { name: 'Hương Giang', img: 'https://randomuser.me/api/portraits/women/5.jpg', mutual: '0 mutual friends', followers: '4.2K followers' },
  { name: 'Văn Tùng', img: 'https://randomuser.me/api/portraits/men/8.jpg',      mutual: '1 mutual friend', followers: '765 followers' },
  { name: 'Nhật Minh', img: 'https://randomuser.me/api/portraits/men/9.jpg',      mutual: '5 mutual friends', followers: '1.8K followers' },
  { name: 'Thúy Vân', img: 'https://randomuser.me/api/portraits/women/6.jpg',     mutual: '2 mutual friends', followers: '2.7K followers' },
  { name: 'Trường Giang', img: 'https://randomuser.me/api/portraits/men/10.jpg',   mutual: '0 mutual friends', followers: '1.4K followers' },
  { name: 'Linh Chi', img: 'https://randomuser.me/api/portraits/women/7.jpg',       mutual: '3 mutual friends', followers: '2.1K followers' },
  { name: 'Đức Thịnh', img: 'https://randomuser.me/api/portraits/men/11.jpg',       mutual: '1 mutual friend', followers: '3.5K followers' },
];

const HomePage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Toolbar />
      <main className={styles.main}>
        <FriendsContainer sidebar={<FriendsSidebar />}>
          <FriendsBanner />
          <FriendsHeader />
          <FriendsGrid friends={friends} />
        </FriendsContainer>
      </main>
    </div>
  );
};

export default HomePage; 