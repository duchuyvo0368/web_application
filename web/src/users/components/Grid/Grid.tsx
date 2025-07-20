/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import UserCard from '../UserCard/UserCard';
import styles from './Grid.module.css';
import { getAllUser } from '../../services/user.service';

interface User {
    id: string;
    name: string;
    img: string;
    mutual?: string;
    followersCount?: string;
    isFollowing: boolean;
}

const UserGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 12;
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = (pageNumber: number) => {
        setLoading(true);
        getAllUser({
            limit,
            page: pageNumber,
            onSuccess: (res) => {
                const rawFriends = res.metadata.data || [];
                const formatted = rawFriends.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    img: item.avatar,
                    followersCount: item.followersCount,
                    isFollowing: item.isFollowing,
                }));

                setFriends(formatted);
                setTotalPages(res.metadata.pagination?.totalPages || 1);
                setLoading(false);
            },
            onError: (err) => {
                console.error('Lỗi khi lấy bạn bè:', err);
                setLoading(false);
            },
        });
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    return (
        <div className={`${className} ${styles.gridWrapper}`}>
            {/* Overlay loading */}
            {loading && (
                <div className={styles.loadingOverlay}>
                    <p>Loading data...</p>
                </div>
            )}

            {/* Danh sách user */}
            <div className={styles.gridContainer} style={{ opacity: loading ? 0.3 : 1 }}>
                {friends.map((friend, index) => (
                    <UserCard
                        id={friend.id}
                        key={`${friend.name}-${index}`}
                        name={friend.name}
                        img={friend.img}
                        isFollowing={friend.isFollowing}
                        mutual=""
                        followersCount={friend.followersCount}
                    />
                ))}
            </div>

            {/* Phân trang */}
            <div className={styles.pagination}>
                <button onClick={handlePrev} disabled={page === 1 || loading} className={styles.pageBtn}>
                Previous
                </button>
                <span className={styles.pageInfo}>
                    Page {page} / {totalPages}
                </span>
                <button onClick={handleNext} disabled={page === totalPages || loading} className={styles.pageBtn}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserGrid;
