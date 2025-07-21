'use client';
import React, { useEffect, useState } from 'react';
import FriendCard from '../FriendCard/FriendCard';
import styles from './Grid.module.css';
import { getFriends } from '../../services/friends.service';

interface Friend {
    _id: string;
    userId: string;
    name: string;
    avatar: string;
    followingCount?: string;
}

const FriendsGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFriends({
            limit: 12,
            onSuccess: (res) => {
                const rawFriends = res.metadata.data || [];

                const formatted = rawFriends.map((user: any) => ({
                    _id: rawFriends._id,
                    userId: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    followingCount: user.countFollowers?.toString() + ' followers' || '0 followers',
                }));

                setFriends(formatted);
                setLoading(false);
                console.log("data" + formatted)
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
            {friends.map((friend, idx) => (
                <FriendCard
                    key={friend._id || idx}
                    userId={friend.userId}
                    name={friend.name}
                    img={friend.avatar}
                    followingCount={friend.followingCount} mutual={''}
                />
            ))}
        </div>
    );
};

export default FriendsGrid;
