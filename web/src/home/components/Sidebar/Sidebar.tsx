import React from 'react';
import styles from './Sidebar.module.css';

const FriendsSidebar: React.FC = () => (
  <div className={styles.sidebarWrapper}>
    <h2 className={styles.sidebarTitle}>Friends</h2>
    <ul className={styles.menuList}>
      <li className={`${styles.menuItem} ${styles.menuItemActive}`}>All</li>
      <li className={`${styles.menuItem} ${styles.menuItemInactive}`}>Friends</li>
      <li className={`${styles.menuItem} ${styles.menuItemInactive}`}>Friend requests</li>
      <li className={`${styles.menuItem} ${styles.menuItemInactive}`}>Following</li>
    </ul>
    <div className={styles.newFriendsSection}>
      <h4 className={styles.newFriendsTitle}>New friends</h4>
      <div className={styles.newFriendsRow}>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className={styles.newFriendsAvatar} />
        <span className={styles.newFriendsText}>Châu Đức and Hương Hồng have accepted your friend request.</span>
      </div>
      <div className={styles.newFriendsTime}>4 hours ago</div>
    </div>
  </div>
);

export default FriendsSidebar; 