import React, { ReactNode } from 'react';
import styles from './Container.module.css';

interface FriendsContainerProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
}

const FriendsContainer: React.FC<FriendsContainerProps> = ({ sidebar, children, className = '' }) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default FriendsContainer;