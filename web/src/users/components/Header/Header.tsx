import React from 'react';
import styles from './Header.module.css';
interface FriendsHeaderProps {
    title: string;
}
const FriendsHeader: React.FC<FriendsHeaderProps> = ({ title }) => (
  <div className={styles.headerWrapper}>
    <h2 className={styles.headerTitle}>
    {title} <span className={styles.headerCount}>1,056 friends</span>
    </h2>
    <input
      type="text"
      placeholder="Enter friends' names, VDB ID..."
      className={styles.headerInput}
    />
  </div>
);

export default FriendsHeader; 