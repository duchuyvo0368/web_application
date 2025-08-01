/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';
import { addFriend, unFriend } from '@/app/friends/friends.service';

interface FriendCardProps {
  userId: string;
  name: string;
  avatarUrl: string;
  mutualFriends?: string;
  followerCount?: string;
  isInitiallyFriend?: boolean;
  onAddFriend?: () => void;
  onUnfriend?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  userId,
  name,
  avatarUrl,
  mutualFriends,
  followerCount = 0,
  isInitiallyFriend = true,
  onAddFriend,
  onUnfriend,
}) => {
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(isInitiallyFriend);

  const handleToggleFriend = async () => {
    setLoading(true);
    if (!isFriend) {
      await addFriend({
        userId,
        onSuccess: () => {
          console.log('Đã gửi lời mời kết bạn');
          setIsFriend(true);
          onAddFriend?.();
        },
        onError: (err) => console.error('Lỗi khi gửi lời mời:', err),
      });
    } else {
      await unFriend({
        userId,
        onSuccess: () => {
          console.log('Đã hủy kết bạn');
          setIsFriend(false);
          onUnfriend?.();
        },
        onError: (err) => console.error('Lỗi khi hủy kết bạn:', err),
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 w-full max-w-[300px] transition hover:shadow-md border border-gray-100">
      <Link
        href={`/profile/${userId}`}
        className="flex flex-col items-center text-center no-underline text-black"
      >
        <img
          src={avatarUrl}
          alt={name}
          className="w-20 h-20 rounded-full object-cover mb-3 border border-gray-300"
  
        />
        <div>
          <h3 className="text-base font-semibold">{name}</h3>
          {mutualFriends && <p className="text-sm text-gray-500">{mutualFriends} mutual friends</p>}
          <p className="text-sm text-gray-500">{followerCount}</p>
        </div>
      </Link>

      <div className="mt-4 flex justify-center">
        <button
          className={`px-4 py-1 text-sm rounded-full transition ${
            isFriend
              ? 'bg-blue-100 text-blue-600 border border-blue-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={handleToggleFriend}
          disabled={loading}
        >
          {isFriend ? '✓ Unfriend' : 'Add Friend'}
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
