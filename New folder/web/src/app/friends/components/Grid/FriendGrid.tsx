/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import FriendCard from '../Card/FriendCard';
import { getFriends } from '../../friends.service';

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
          _id: user._id,
          userId: user._id,
          name: user.name,
          avatar: user.avatar,
          followingCount:
            (user.countFollowers?.toString() ?? '0') + ' followers',
        }));

        setFriends(formatted);
        setLoading(false);
      },
      onError: (err) => {
        console.error('Error Get Friends', err);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading Friend...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {friends.map((friend, idx) => (
        <FriendCard
          key={friend._id || idx}
          userId={friend.userId}
          name={friend.name}
          avatarUrl={friend.avatar}
          followerCount={friend.followingCount}
          mutualFriends="1"
        />

      ))}
    </div>
  );
};

export default FriendsGrid;
