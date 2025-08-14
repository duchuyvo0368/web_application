/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import UserCard from '../card/UserCard';
import UserCardSkeleton from '../../../friends/components/skeleton/UserCardSkeleton';
import { getAllUser } from '../../user.service';

interface User {
    id: string;
    name: string;
    img: string;
    mutual?: string;
    followersCount?: string;
    isFollowing: boolean;
}

const UserGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;

    const fetchUsers = (pageNumber: number) => {
        setLoading(true);
        getAllUser({
            limit,
            page: pageNumber,
            onSuccess: (res) => {
                const rawUsers = res.metadata?.data || [];
                const formatted = rawUsers.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    img: item.avatar,
                    followersCount: item.followersCount,
                    isFollowing: item.isFollowing,
                }));

                setUsers(formatted);
                setTotalPages(res.metadata?.pagination?.totalPages || 1);
                setLoading(false);
            },
            onError: (err) => {
                console.error('❌ Error fetching users:', err);
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
        <div className={`flex flex-col ${className}  pb-20`}>
            {/* Grid danh sách user */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading
                    ? Array.from({ length: limit }).map((_, index) => (
                        <UserCardSkeleton key={index} />
                    ))
                    : users.map((user) => (
                        <UserCard
                            key={user.id}
                            userId={user.id}
                            name={user.name}
                            avatar={user.img}
                            followersCount={parseInt(user.followersCount || '0')}
                            mutualFriends="2 mutual friends"
                            isFollowing={user.isFollowing}
                        />
                    ))}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    onClick={handlePrev}
                    disabled={page === 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-sm font-medium text-gray-700">
                    Page {page} / {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages || loading}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserGrid;
