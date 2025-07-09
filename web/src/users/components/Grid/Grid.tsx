/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import UserCard from '../UserCard/UserCard';
import styles from './Grid.module.css';
import { getAllUser } from '../../services/user.service';

interface User {
  name: string;
  img: string;
  mutual?: string;
  followers?: string;
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
        <UserCard
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
