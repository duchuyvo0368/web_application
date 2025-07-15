'use client';
import React, { useEffect, useState } from 'react';
import FriendCard from '../RequestCard/RequestSentCard';
import styles from './Grid.module.css';
import {  getRequestSent } from '../../services/request.sent.service';
import RequestSentCard from '../RequestCard/RequestSentCard';


interface RequestSent {
    _id: string;
    name: string;
    avatar: string;
    mutual?: string;
    followersCount?: string;
}

const RequestSentGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<RequestSent[]>([]);
    const [loading, setLoading] = useState(true);

    console.log('RequestSentGrid rendered', friends);
    useEffect(() => {
        getRequestSent({
                onSuccess: (res) => {
                    const requests = res.metadata || [];
        
                    const formatted = requests.map((item: any) => ({
                        _id: item.toUser._id, 
                        name: item.toUser.name,
                        avatar: item.toUser.avatar,
                        followersCount: item.toUser.followersCount?.toString() ,
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
                <RequestSentCard
                    key={friend._id}
                    userId={friend._id}
                    name={friend.name}
                    img={friend.avatar}
                    mutual={''}
                    followersCount={`${friend.followersCount ?? 0} followers`}
                />
            ))}
        </div>
    );
};

export default RequestSentGrid;
