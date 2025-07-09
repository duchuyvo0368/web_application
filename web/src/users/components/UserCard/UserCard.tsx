/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styles from './UserCard.module.css';

interface FriendCardProps {
    name: string;
    img: string;
    mutual: string;
    followers?: string;
}

const FriendCard: React.FC<FriendCardProps> = ({ name, img, mutual, followers = '0 followers' }) => {
    const [isFriend, setIsFriend] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleAddFriend = () => {
        setIsFriend(!isFriend);
        // TODO: Add API call to add friend
    };

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // TODO: Add API call to follow user
    };

    return (
        <div className={styles.friendCard}>
            <img
                src={img}
                alt={name}
                className={styles.friendAvatar}
            />
            <div className={styles.friendInfo}>
                <h3 className={styles.friendName}>{name}</h3>
                <p className={styles.friendMutual}>{mutual}</p>
                <p className={styles.followerCount}>{followers}</p>
                <div className={styles.buttonGroup}>
                    <button 
                        className={`${styles.actionButton} ${isFriend ? styles.activeButton : ''}`}
                        onClick={handleAddFriend}
                    >
                        {isFriend ? '✓ Friends' : 'Add Friend'}
                    </button>
                    <button 
                        className={`${styles.actionButton} ${isFollowing ? styles.activeButton : ''}`}
                        onClick={handleFollow}
                    >
                        {isFollowing ? '✓ Following' : 'Follow'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendCard;