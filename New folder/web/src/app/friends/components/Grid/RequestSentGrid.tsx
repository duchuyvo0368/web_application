'use client';
import React, { useEffect, useState } from 'react';
import RequestSentCard from '../Card/RequestSentCard';
import { getRequestSent } from '../../friends.service';

interface RequestSent {
    _id: string;
    userId: string;
    name: string;
    avatar: string;
    mutual?: string;
    followersCount?: string;
}

const RequestSentGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<RequestSent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRequestSent({
            limit: 12,
            page: 1,
            onSuccess: (res) => {
                const requests = res.metadata || [];

                const formatted = requests.map((item: any) => ({
                    _id: item._id,
                    userId: item.toUser._id,
                    name: item.toUser.name,
                    avatar: item.toUser.avatar,
                    followersCount: item.toUser.followersCount?.toString(),
                }));

                setFriends(formatted);
                setLoading(false);
            },
            onError: (err) => {
                console.error('Error Get Request Sent:', err);
                setLoading(false);
            },
        });
    }, []);

    if (loading) {
        return <p className="text-center text-sm text-gray-500">Đang tải danh sách bạn bè...</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map((friend) => (
                <RequestSentCard
                    key={friend._id}
                    userId={friend.userId}
                    name={friend.name}
                    img={friend.avatar}
                    mutual=""
                    followersCount={`${friend.followersCount ?? 0} followers`}
                />
            ))}
        </div>
    );
};

export default RequestSentGrid;
