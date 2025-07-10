/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styles from './UserCard.module.css';
import { addFollow, addFriend } from '../../services/user.service';

interface FriendCardProps {
    id: string; 
    name: string;
    img: string;
    mutual: string;
    followersCount?: string;
}

const FriendCard: React.FC<FriendCardProps> = ({ name, id, img, mutual, followersCount }) => {
    const [isFriend, setIsFriend] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleAddFriend = () => {
        addFriend({
            toUser: id,
            onSuccess: (data) => {
                console.log('Đã gửi lời mời kết bạn:', id);
                setIsFriend(true); // Cập nhật UI
            },
            onError: (err) => {
                console.error('Lỗi khi gửi lời mời:', err);
            }
        });
    };

    const handleFollow = () => {
        addFollow({
            toUser: id,
            onSuccess: (data) => {
                console.log('Đã gửi lời mời kết bạn:', id);
                setIsFollowing(!isFollowing);
            },
            onError: (err) => {
                console.error('Lỗi khi gửi lời mời:', err);
            }
        });
        
    };
    const handleUnfollow = () => {
        // removeFollow({
        //     toUser: id,
        //     onSuccess: () => {
        //         console.log('Đã bỏ theo dõi:', id);
                setIsFollowing(false);
        //     },
        //     onError: (err) => {
        //         console.error('Lỗi khi bỏ theo dõi:', err);
        //     }
        // });
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
                <p className={styles.followerCount}>{followersCount}</p>
                <div className={styles.buttonGroup}>
                    <button 
                        className={`${styles.actionButton} ${isFriend ? styles.activeButton : ''}`}
                        onClick={handleAddFriend}
                    >
                        {isFriend ? '✓ Friends' : 'Add Friend'}
                    </button>
                    <button
                        className={`${styles.actionButton} ${isFollowing ? styles.activeButton : ''}`}
                        onClick={isFollowing ? handleUnfollow : handleFollow}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}

                    </button>

                </div>
            </div>
        </div>
    );
};

export default FriendCard;