'use client';
import React, { useEffect, useState } from 'react';
import { getFriendPending } from '../../friends.service';
import FriendRequestCard from '../card/FriendsRequestCard';

interface Friend {
     _id: string;
     userId: string;
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
                         userId: item.fromUser._id,
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

     if (loading) return <p className="text-center text-gray-500">Loading...</p>;

     return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {friends.map((friend) => (
                    <FriendRequestCard
                         key={friend._id}
                         userId={friend.userId}
                         requestId={friend._id}
                         name={friend.name}
                         img={friend.avatar}
                         followers={friend.followers}
                         mutual=""
                    />
               ))}
          </div>
     );
};

export default FriendsRequestGrid;
