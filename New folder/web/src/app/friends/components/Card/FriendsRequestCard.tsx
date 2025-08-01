/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/app/friends/friends.service';

interface FriendRequestCardProps {
  requestId: string;
  userId: string;
  name: string;
  img: string;
  mutual: string;
  followers?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onUnAccept?: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  requestId,
  userId,
  name,
  img,
  mutual,
  followers = '0 followers',
  onAccept,
  onReject,
  onUnAccept,
}) => {
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleAccept = async () => {
    try {
      await acceptFriendRequest({
        userId,
        onSuccess: (res:any) => {
          setAccepted(true);
          onAccept?.();
        },
        onError: (err:any) => {
          console.error('Accept failed:', err);
        },
      });
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleReject = async () => {
    try {
      await rejectFriendRequest({
        userId,
        onSuccess: () => {
          setRejected(true);
          onReject?.();
        },
        onError: (err:any) => {
          console.error('Reject failed:', err);
        },
      });
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleUnAccept = () => {
    setAccepted(false);
    onUnAccept?.();
  };

  if (rejected) {
    return (
      <div className="p-4 border rounded text-red-500">
        ❌ You rejected {name}'s request.
      </div>
    );
  }

  return (
   <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 w-full max-w-sm transition hover:shadow-lg">
  <Link
    href={`/profile/${userId}`}
    className="flex gap-4 items-center group"
  >
    <img
      src={img}
      alt={name}
      className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-300 transition"
    />
    <div>
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition">
        {name}
      </h3>
      {mutual && <p className="text-sm text-gray-500">{mutual}</p>}
      {followers && <p className="text-sm text-gray-500">{followers}</p>}
    </div>
  </Link>

  <div className="mt-5 flex gap-3">
    {!accepted ? (
      <>
        <button
          onClick={handleAccept}
          className="flex-1 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="flex-1 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Reject
        </button>
      </>
    ) : (
      <button
        onClick={handleUnAccept}
        className="w-full px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg"
      >
        ✓ Accepted
      </button>
    )}
  </div>
</div>

  );
};

export default FriendRequestCard;
