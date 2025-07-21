/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styles from './FriendCard.module.css';
import { addFriend, unFriend } from '../../services/friends.service';

interface FriendCardProps {
    name: string;
    img: string;
    userId: string;
    mutual: string;
    followingCount?: string;
    isInitiallyFriend?: boolean;
    onAddFriend?: () => void;
    onUnfriend?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
    name,
    img,
    userId,
    mutual,
    followingCount,
    isInitiallyFriend = false,
    onAddFriend,
    onUnfriend,
}) => {
    const [isFriend, setIsFriend] = useState(isInitiallyFriend);

    const handleToggleFriend = () => {
        if (isFriend) {
            // addFriend({
            //     toUser: userId,
            //     onSuccess: (data) => {
            //         console.log('Đã gửi lời mời kết bạn:', data);
            //     },
            //     onError: (err) => {
            //         console.error('Lỗi khi gửi lời mời kết bạn:', err);
            //     }
            // })
            onAddFriend?.();
        } else {
            console.log('userId:' + userId)
            unFriend({
                userId,
                onSuccess: (data) => {
                    console.log('Đã hủy kết bạn:', data);
                },
                onError: (err) => {
                    console.error('Lỗi khi hủy kết bạn:', err);
                },
            });
            onUnfriend?.()
        }
        setIsFriend(!isFriend);
    };

    return (
        <div className={styles.friendCard}>
            <img src={img} alt={name} className={styles.friendAvatar} />
            <div className={styles.friendInfo}>
                <h3 className={styles.friendName}>{name}</h3>
                <p className={styles.friendMutual}>{mutual}</p>
                <p className={styles.followerCount}>{followingCount}</p>
                <button
                    className={`${styles.actionButton} ${isFriend ? '' : styles.activeButton}`}
                    onClick={handleToggleFriend}
                >
                    {isFriend ? 'Add Friend' : '✓ Unfriend'}
                </button>

            </div>
        </div>
    );
};

export default FriendCard;
