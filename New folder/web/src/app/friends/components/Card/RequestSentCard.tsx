/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { cancelRequest } from '../../friends.service';
import Link from 'next/link';

interface RequestSentCardProps {
    userId: string;
    name: string;
    img: string;
    mutual?: string;
    followersCount?: string;
    onCancel?: () => void;
    onAddFriend?: () => void;
}

const RequestSentCard: React.FC<RequestSentCardProps> = ({
    userId,
    name,
    img,
    mutual,
    followersCount,
    onCancel,
    onAddFriend,
}) => {
    const [cancel, setCancel] = useState(false);
    const [addFriends, setAddFriend] = useState(false);

    const handleCancelRequest = async () => {
        try {
            await cancelRequest({
                userId,
                onSuccess: (res) => console.log('Accepted successfully:', res),
                onError: (err) => console.error('Error Accepted:', err),
            });
            setCancel(true);
            onCancel?.();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleAddFriends = () => {
        setAddFriend(false);
        onAddFriend?.();
    };

    if (cancel) {
        return (
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm text-center text-red-600 bg-red-50">
                ❌ You cancelled {name}&apos;s request.
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg border border-gray-200 shadow hover:shadow-md transition bg-white flex items-center gap-4">
            <Link href={`/profile/${userId}`} className="flex items-center gap-4 flex-1">
                <img
                    src={img}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                    {mutual && <p className="text-xs text-gray-500">{mutual}</p>}
                    {followersCount && (
                        <p className="text-xs text-gray-500">{followersCount}</p>
                    )}
                </div>
            </Link>

            <div className="flex flex-col gap-2">
                {!addFriends ? (
                    <button
                        onClick={handleCancelRequest}
                        className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                    >
                        Delete
                    </button>
                ) : (
                    <button
                        onClick={handleAddFriends}
                        className="px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        ✓ Add Friend
                    </button>
                )}
            </div>
        </div>
    );
};

export default RequestSentCard;
