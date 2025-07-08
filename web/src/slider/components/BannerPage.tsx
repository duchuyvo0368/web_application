import React, { useState } from 'react';
import styles from './BannerPage.module.css';
import Toolbar from '../../home/components/Header/Header';
import { FaUserFriends, FaUserPlus, FaUserCheck, FaUser } from 'react-icons/fa';

const menu = [
  { label: 'All', icon: <FaUserFriends /> },
  { label: 'Friends', icon: <FaUserPlus /> },
  { label: 'Friend requests', icon: <FaUserCheck /> },
  { label: 'Following', icon: <FaUser /> },
];

const fakeFriends = [
  {
    id: 1,
    name: 'Châu Đức and Hương Hồng',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    message: 'have accepted your friend request.',
    time: '4 hours ago',
  },
];

export default function FriendsPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Toolbar />
      </div>
      <div className={styles.content}>
        <div className={styles.stickyHeader}>
          <h2 className={styles.title}>Friends</h2>
          <div>
            {menu.map((item, idx) => (
              <div
                key={item.label}
                onClick={() => setSelected(idx)}
                className={
                  selected === idx
                    ? `${styles.menuItem} ${styles.menuItemActive}`
                    : styles.menuItem
                }
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.newFriendsTitle}>New friends</div>
        {fakeFriends.map(friend => (
          <div key={friend.id} className={styles.friendCard}>
            <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
            <div>
              <div className={styles.friendMessage}>
                {friend.name} <span className={styles.friendMessageText}>{friend.message}</span>
              </div>
              <div className={styles.friendTime}>{friend.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 