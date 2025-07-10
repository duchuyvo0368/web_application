'use client';
import React, { useEffect, useState } from 'react';
import FriendCard from '../FriendCard/FriendCard';
import styles from './Grid.module.css';
import { getFriends } from '../../services/friends.service';

interface Friend {
    _id: string;
    name: string;
    avatar: string;
    followingCount?: string;
}

const FriendsGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFriends({
            onSuccess: (res) => {
                const rawFriends = res.metadata.friends || [];

                const formatted = rawFriends.map((user: any) => ({
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    followingCount: user.followingCount?.toString() || '0 followers',
                }));

                setFriends(formatted);
                setLoading(false);
            },
            onError: (err) => {
                console.error('Lỗi khi lấy bạn bè:', err);
                setLoading(false);
            },
          });
    }, []);

    if (loading) return <p>Đang tải danh sách bạn bè...</p>;

    return (
        <div className={`${styles.gridContainer} ${className}`}>
            {friends.map((friend) => (
                <FriendCard
                    key={friend._id}
                    id={friend._id}
                    name={friend.name}
                    img={friend.avatar}
                    followingCount={friend.followingCount} mutual={''}
                />
            ))}
        </div>
    );
};

export default FriendsGrid;
