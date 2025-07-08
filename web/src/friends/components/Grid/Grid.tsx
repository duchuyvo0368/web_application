/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import FriendCard from '../FriendCard/FriendCard';
import styles from './Grid.module.css';
import { getMutualFriend } from '../../services/friends.service';

interface Friend {
  name: string;
  img: string;
  mutual?: string;
  followers?: string;
}

const FriendsGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMutualFriend({
      limit: 15,
      onSuccess: (res) => {
        const rawFriends = res.metadata?.data || [];

        const formatted = rawFriends.map((item: any) => ({
          name: item.name,
          img: item.avatar,
          mutual: item.mutual || '0 mutual friends',
          followers: item.followers || '0 followers',
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
        <FriendCard
          key={`${friend.name}-${index}`}
          name={friend.name}
          img={friend.img}
          mutual={friend.mutual}
          followers={friend.followers}
        />
      ))}
    </div>
  );
};

export default FriendsGrid;
