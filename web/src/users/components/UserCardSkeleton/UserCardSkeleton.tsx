import React from 'react';
import styles from './UserCard.module.css';

const UserCardSkeleton: React.FC = () => {
    return (
        <div className={`${styles.card} ${styles.skeleton}`}>
            <div className={styles.avatarSkeleton} />
            <div className={styles.nameSkeleton} />
            <div className={styles.buttonSkeleton} />
        </div>
    );
};

export default UserCardSkeleton;
