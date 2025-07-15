/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import UserCard from '../UserCard/UserCard';
import styles from './Grid.module.css';
import { getAllUser } from '../../services/user.service';

interface User {
    id: string;
    name: string;
    img: string;
    mutual?: string;
    followersCount?: string;
}

const FriendsGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllUser({
            limit: 15,
            onSuccess: (res) => {
                const rawFriends = res.metadata.users || [];

                const formatted = rawFriends.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    img: item.avatar,
                    mutual: item.mutual || '0 mutual friends',
                    followersCount: item.followersCount ,
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
            {friends.map((friend, index) => (
                <UserCard
                    id={friend.id}
                    key={`${friend.name}-${index}`}
                    name={friend.name}
                    img={friend.img}
                    mutual=""
                    followersCount={`${friend.followersCount ?? 0} followers`}

                />
            ))}
        </div>
    );
};

export default FriendsGrid;
