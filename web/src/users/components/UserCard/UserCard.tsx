/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import styles from './UserCard.module.css';
import { addFollow, addFriend, unFollow } from '../../services/user.service';
import Link from 'next/link';

interface FriendCardProps {
    id: string;
    name: string;
    img: string;
    mutual: string;
    followersCount?: string; // chuỗi hoặc undefined
    isFollowing?: boolean;
}

// Parse follower count an toàn
const parseFollowerCount = (val: string | undefined): number => {
    const num = Number(val);
    return num;
};

const FriendCard: React.FC<FriendCardProps> = ({
    id,
    name,
    img,
    mutual,
    followersCount,
    isFollowing: isFollowingProp = false,
}) => {
    const [isFriend, setIsFriend] = useState(false);
    const [isFollowing, setIsFollowing] = useState(isFollowingProp);
    const [loading, setLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(parseFollowerCount(followersCount));

    // Log để kiểm tra giá trị props truyền vào
    useEffect(() => {
        console.log(`[DEBUG] followersCount prop from parent:`, followersCount);
        setIsFollowing(isFollowingProp);
        setFollowerCount(parseFollowerCount(followersCount));
    }, [isFollowingProp, followersCount]);

    const handleAddFriend = () => {
        if (loading) return;
        setLoading(true);
        addFriend({
            userId: id,
            onSuccess: () => {
                setIsFriend(true);
                setLoading(false);
            },
            onError: (err) => {
                console.error('Lỗi khi gửi lời mời:', err);
                setLoading(false);
            },
        });
    };

    const handleToggleFollow = () => {
        if (loading) return;
        setLoading(true);

        const wasFollowing = isFollowing;
        const prevCount = followerCount;

        // UI cập nhật tức thời
        const newIsFollowing = !wasFollowing;
        const newCount = newIsFollowing ? prevCount + 1 : Math.max(0, prevCount - 1);

        setIsFollowing(newIsFollowing);
        setFollowerCount(newCount);

        const action = newIsFollowing ? addFollow : unFollow;

        action({
            userId: id,
            onSuccess: () => {
                setLoading(false);
            },
            onError: (err) => {
                console.error('Lỗi follow/unfollow:', err);
                // Rollback nếu có lỗi
                setIsFollowing(wasFollowing);
                setFollowerCount(prevCount);
                setLoading(false);
            },
        });
    };

    return (

        <div className={styles.friendCard}>
            <Link href={`/profile/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={img} alt={name} className={styles.friendAvatar} />
                <div className={styles.friendInfo}>
                    <h3 className={styles.friendName}>{name}</h3>
                    <p className={styles.friendMutual}>{mutual}</p>
                    <p className={styles.followerCount}>{followerCount} followers</p>
                </div>
            </Link>
            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.actionButton} ${isFriend ? styles.activeButton : ''}`}
                    onClick={handleAddFriend}
                    disabled={isFriend || loading}
                >
                    {isFriend ? '✓ Friends' : 'Add Friend'}
                </button>

                <button
                    className={`${styles.actionButton} ${isFollowing ? styles.activeButton : ''}`}
                    onClick={handleToggleFollow}
                    disabled={loading}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        
    </div >
   
  );
};

export default FriendCard;
