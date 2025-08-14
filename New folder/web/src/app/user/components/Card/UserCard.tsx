/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { addFollow, addFriend, unFollow, cancelRequest } from '../../user.service';
import Link from 'next/link';
import { UserCardProps } from '../../type';



const UserCard: React.FC<UserCardProps> = ({
    userId,
    name,
    avatar,
    mutualFriends,
    followersCount,
    isFollowing: isFollowingProp = false,
}) => {
    const [hasSentFriendRequest, setHasSentFriendRequest] = useState(false);
    const [isFollowing, setIsFollowing] = useState(isFollowingProp);
    const [loading, setLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(followersCount);

   
    useEffect(() => {
        setIsFollowing(isFollowingProp);
        setFollowerCount(followersCount);
    }, [isFollowingProp, followersCount]);

    const handleToggleFriendRequest = () => {
        if (loading) return;
        setLoading(true);

        const action = hasSentFriendRequest ? cancelRequest : addFriend;

        action({
            userId,
            onSuccess: () => {
                setHasSentFriendRequest(!hasSentFriendRequest);
                setLoading(false);
            },
            onError: (err) => {
                console.error('Error handling friend request:', err);
                setLoading(false);
            },
            onFinally: () => {
                setLoading(false);
            },
        });
    };

    const handleToggleFollow = () => {
        if (loading) return;
        setLoading(true);

        const prevState = isFollowing;
        const prevCount = followerCount || 0;
        const newState = !prevState;
        const newCount = newState ? prevCount + 1 : Math.max(0, prevCount - 1);

        setIsFollowing(newState);
        setFollowerCount(newCount);

        const action = newState ? addFollow : unFollow;
        action({
            userId,
            onSuccess: () => setLoading(false),
            onError: (err: any) => {
                console.error('Follow/unfollow failed:', err);
                setIsFollowing(prevState);
                setFollowerCount(prevCount);
                setLoading(false);
            },
            onFinally: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="bg-white shadow-sm rounded-xl p-4 w-full max-w-[300px]">
            <Link href={`/profile/${userId}`} className="flex flex-col items-center text-center no-underline text-black">
                <img
                    src={avatar}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover mb-3 border border-gray-300"
                />
                <div>
                    <h3 className="text-base font-semibold">{name}</h3>
                    {mutualFriends && <p className="text-sm text-gray-500">{mutualFriends}</p>}
                    <p className="text-sm text-gray-500">{followerCount} followers</p>
                </div>
            </Link>

            <div className="mt-4 flex justify-center gap-3">
                <button
                    className={`px-4 py-1 text-sm rounded-full transition ${hasSentFriendRequest
                        ? 'bg-blue-100 text-blue-600 border border-blue-500'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    onClick={handleToggleFriendRequest}
                    disabled={loading}
                >
                    {hasSentFriendRequest ? '✓ Friends' : 'Add Friend'}
                </button>

                <button
                    className={`px-4 py-1 text-sm rounded-full border transition ${isFollowing
                        ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                        }`}
                    onClick={handleToggleFollow}
                    disabled={loading}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        </div>
    );
};

export default UserCard;
