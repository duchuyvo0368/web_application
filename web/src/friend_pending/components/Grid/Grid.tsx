'use client';
import React, { useEffect, useState } from 'react';
import FriendCard from '../FriendRequestCard/FriendRequestCard';
import styles from './Grid.module.css';
import { getFriendPending } from '../../services/friend_request.service';


interface Friend {
    _id: string;
    userId: string
    name: string;
    avatar: string;
    followers?: string;
}

const FriendsRequestGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFriendPending({
            onSuccess: (res) => {
                const requests = res.metadata || [];

                const formatted = requests.map((item: any) => ({
                    _id: item._id,
                    userId:item.fromUser._id,
                    name: item.fromUser.name,
                    avatar: item.fromUser.avatar,
                    followers: item.fromUser.followers?.toString() || '0 followers',
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
                    userId={friend.userId}
                    key={friend._id}
                    name={friend.name}
                    img={friend.avatar}
                    followers={friend.followers} mutual={''} />
            ))}
        </div>
    );
};

export default FriendsRequestGrid;
