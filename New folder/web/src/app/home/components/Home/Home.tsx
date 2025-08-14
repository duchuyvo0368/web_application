/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { getPostUser } from '../../home.service';
import PostCard from '../../../posts/components/PostCard';
import { UserInfo } from '../../type';
import CreatePostModal from '@/app/posts/components/CreatePostModal';
import { PostFromServer } from '@/app/posts/type';
import InfiniteScroll from '@/app/components/infinitescroll/IfiniteScroll';

const POSTS_PER_PAGE = 1;

const Home: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState<PostFromServer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
            setUserInfo(info);
        }
    }, []);

    const loadMoreData = () => {
        if (loading) return;
        if (page >= totalPages && totalPages > 0) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            getPostUser({
                limit: POSTS_PER_PAGE,
                page,
                onSuccess: (data) => {
                    setPosts((prev) => {
                        const merged = [...prev, ...data.data];
                        const uniquePosts = Array.from(
                            new Map(merged.map((p) => [p._id, p])).values()
                        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        return uniquePosts;
                    });
                    setTotalPages(data.pagination?.totalPages || 0);
                    setLoading(false);
                },
                onError: (err) => {
                    setError(err + ' Error fetching posts');
                    setLoading(false);
                },
            });
        };
        fetchPosts();
    }, [page]);

    const hasMoreData = totalPages === 0 || page < totalPages;

    const handlePostCreated = (newPost: any) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    if (!userInfo) return <div>Loading...</div>;

    return (
        <div className="flex gap-1 mt-6 h-[calc(100vh-80px)]">
            <main className="flex-1 max-w-2xl w-full mx-auto pl-6">
                <div className="bg-white rounded-lg p-4 flex items-center gap-3 h-15 shadow">
                    <img
                        src={userInfo.avatar || '/images/user-image.png'}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                        className="flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full px-4 py-2 text-gray-600"
                        onClick={() => setShowModal(true)}
                    >
                        Share your moments and memories!
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-[9999] pointer-events-auto">
                        <CreatePostModal
                            open={showModal}
                            userInfo={userInfo}
                            onClose={() => setShowModal(false)}
                            onPostCreated={handlePostCreated}
                        />
                    </div>
                )}

                <div className="mt-6 space-y-4 overflow-y-auto pb-28">
                    {error ? (
                        <div className="bg-white p-1 rounded-lg shadow text-red-500 text-center">{error}</div>
                    ) : posts.length === 0 && !loading ? (
                        <div className="bg-white p-1 rounded-lg shadow text-center text-gray-500">No posts yet.</div>
                    ) : (
                        <InfiniteScroll
                            fetchMore={loadMoreData}
                            hasMore={hasMoreData}
                            loader={<div className="text-center p-4">Loading posts...</div>}
                            endMessage={<div className="text-center p-4 text-gray-500">No more posts</div>}
                            className="space-y-4"
                        >
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    userName={post.userId.name || userInfo.name}
                                    postId={post._id}
                                    avatar={post.userId.avatar || userInfo.avatar}
                                    time={post.createdAt}
                                    title={post.title || 'No title'}
                                    content={post.content || ''}
                                    hashtags={post.hashtags ?? []}
                                    images={Array.isArray(post.images) ? post.images : []}
                                    videos={Array.isArray(post.videos) ? post.videos : []}
                                    createdAt={post.createdAt}
                                    feel={post.feel || {}}
                                    privacy={post.privacy}
                                    feelCount={{
                                        like: post.feelCount?.like || 0,
                                        haha: post.feelCount?.haha || 0,
                                        love: post.feelCount?.love || 0,
                                    }}
                                    comments={post.comments}
                                    views={post.views}
                                    post_link_meta={post.post_link_meta}
                                />
                            ))}
                        </InfiniteScroll>
                    )}
                    {loading && posts.length === 0 && (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                            Loading posts...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
