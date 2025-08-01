/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import Container from '@/app/components/Container/Container';
import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/SideBar/SideBar';
import { getProfile, uploadFile } from '@/app/user/user.service';
import SkeletonProfile from '@/app/user/components/Skeleton/SkeletonProfile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useParams } from 'next/navigation';

const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<{ name: string; avatar?: string; email?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [relation, setRelation] = useState<string | null>(null);
    const [followingCount, setFollowingCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [friendLoading, setFriendLoading] = useState(false);
    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        if (id && typeof id === 'string') {
            setUserId(id);
        } else if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('userInfo');
            const user = userData ? JSON.parse(userData) : null;
            if (user?._id) setUserId(user._id);
        }
    }, [id]);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        getProfile({
            userId,
            onSuccess: (data: any) => {
                const { user, relation, followingCount, followersCount, countFriends, isFollowing } =
                    data.metadata;
                setUser(user);
                setRelation(relation);
                setFollowingCount(followingCount || 0);
                setFollowerCount(followersCount || 0);
                setFriendCount(countFriends || 0);
                setIsFollowing(isFollowing || false);
                setLoading(false);
            },
            onError: (err: any) => {
                console.error('Load profile failed:', err);
                setLoading(false);
            },
        });
    }, [userId]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        uploadFile({
            type: 'avatar',
            file,
            onSuccess: (data) => {
                const newAvatarUrl = data.metadata.url;
                setUser((prev) => {
                    if (!prev) return prev;
                    const updated = { ...prev, avatar: newAvatarUrl };

                    try {
                        const stored = localStorage.getItem('userInfo');
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            parsed.avatar = newAvatarUrl;
                            localStorage.setItem('userInfo', JSON.stringify(parsed));
                        }
                    } catch (e) {
                        console.error('Failed to update avatar in localStorage:', e);
                    }

                    window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: newAvatarUrl }));
                    return updated;
                });

                setLoading(false);
            },
            onError: (err) => {
                console.error('Upload avatar failed:', err);
                alert('Failed to upload image!');
                setLoading(false);
            },
        });
    };

   const renderActionButtons = () => {
    const base = 'rounded-xl px-6 py-2 font-semibold text-white transition';
    const disabled = friendLoading || followLoading;

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4 mb-6">
            {relation === 'accepted' && (
                <button disabled={disabled} className={`${base} bg-red-500 hover:bg-red-600`}>
                    Unfriend
                </button>
            )}
            {relation === 'pending_sent' && (
                <button disabled={disabled} className={`${base} bg-gray-500 hover:bg-gray-600`}>
                    Cancel Request
                </button>
            )}
            {relation === 'pending_received' && (
                <button disabled={disabled} className={`${base} bg-blue-600 hover:bg-blue-700`}>
                    Accept
                </button>
            )}
            {relation === 'stranger' && (
                <button disabled={disabled} className={`${base} bg-green-600 hover:bg-green-700`}>
                    Add Friend
                </button>
            )}

            {/* Ẩn Follow nếu là chính mình */}
            {relation !== 'me' && (
                isFollowing ? (
                    <button disabled={disabled} className={`${base} bg-gray-500 hover:bg-gray-600`}>
                        Unfollow
                    </button>
                ) : (
                    <button disabled={disabled} className={`${base} bg-blue-600 hover:bg-blue-700`}>
                        Follow
                    </button>
                )
            )}
        </div>
    );
};


    if (!userId || loading || !user)
        return (
            <div className="p-6">
                <SkeletonProfile />
            </div>
        );

    return (
        <div className="overflow-x-hidden min-h-screen bg-gray-50">
            <Header />
            <main className="flex w-full">
                <Container sidebar={<Sidebar activeTab={activeTab} onSelect={setActiveTab} />}>
                    <div className="w-full px-4 sm:px-6 md:px-8 mt-4">
                        <div className="relative w-full">
                            {/* Cover Image */}
                            <img
                                src="https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd--1000.png"
                                alt="cover"
                                className="w-full h-32 md:h-40 object-cover rounded-lg"
                            />

                            {/* Avatar */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                                <div className="relative">
                                    <img
                                        src={user.avatar}
                                        alt="avatar"
                                        className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md object-cover"
                                    />
                                    {relation === 'me' && (
                                        <label className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1 cursor-pointer shadow">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                            <CameraAltIcon fontSize="small" />
                                        </label>
                                    )}
                                </div>
                                {loading && <div className="text-sm text-gray-500 mt-2">Uploading...</div>}
                            </div>
                        </div>

                        {/* Info section */}
                        <div className="mt-16 text-center">
                            <div className="text-xl font-bold flex justify-center items-center gap-1">
                                {user.name}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="#2196f3" />
                                    <path
                                        d="M8 12.5l2.5 2.5 5-5"
                                        stroke="#fff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="text-gray-600 text-sm">{user.email}</div>
                            <div className="text-gray-500 text-sm mt-1">This is a placeholder for bio info.</div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 mt-6 text-center">
                            <div>
                                <div className="font-bold text-lg">{followerCount}</div>
                                <div className="text-sm text-gray-500">Followers</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">{followingCount}</div>
                                <div className="text-sm text-gray-500">Following</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">{friendCount}</div>
                                <div className="text-sm text-gray-500">Friends</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-center">{renderActionButtons()}</div>
                    </div>

                </Container>
            </main>
        </div>
    );
};

export default ProfilePage;
