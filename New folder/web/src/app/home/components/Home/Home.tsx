
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { getPostUser } from '../../home.service';
import RightSidebar from '../RightSidebar/RightSidebar';
import PostCard from '../../../posts/components/PostCard';
import { UserInfo } from '../../type';
import CreatePostModal from '@/app/posts/components/CreatePostModal';
import { PostFromServer } from '@/app/posts/type';

const Home: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState<PostFromServer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
            setUserInfo(info);
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            getPostUser({
                limit: 10,
                pages: 1,
                onSuccess: (data) => setPosts(data.data),
                onError: (err) =>
                    setError(err + 'Error fetching posts'),

            });
            setLoading(false);
        };
        fetchPosts();
    }, []);



    const handlePostCreated = (newPost: any) => {
        setPosts(prev => [newPost, ...prev]);
    };

    if (!userInfo) return <div>Loading...</div>;

    return (


        <div className="flex gap-1 mt-6 h-[calc(100vh-80px)]">
            {/* Main Content */}
            <main className="flex-1 max-w-2xl w-full mx-auto pl-6">
                {/* Post Creation Bar */}
                <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
                    <img
                        src={userInfo.avatar || "/images/user-image.png"}
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

                {/* Modal */}
                {showModal && userInfo && (
                    <div className="fixed inset-0 z-[9999] pointer-events-auto">
                        <CreatePostModal
                            open={showModal}
                            userInfo={userInfo}
                            onClose={() => setShowModal(false)}
                            onPostCreated={handlePostCreated}
                        />
                    </div>
                )}


                {/* Posts */}
                <div className="mt-6 space-y-4  overflow-y-auto  pb-28">
                    {error ? (
                        <div className="bg-white p-4 rounded-lg shadow text-red-500 text-center">{error}</div>
                    ) : loading ? (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                            Loading posts...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                            No posts yet.
                        </div>
                    ) : (

                        posts.map((post, idx) => (
                            <PostCard
                                key={post._id || idx}
                                userName={post.userId.name}
                                postId={post._id}
                                avatar={post.userId.avatar}
                                time={post.createdAt || ""}
                                title={post.title || "No title"}
                                content={post.content || ""}
                                hashtags={post.hashtags ?? []}
                                images={Array.isArray(post.images) ? post.images : []}
                                videos={Array.isArray(post.videos) ? post.videos : []}
                                createdAt={post.createdAt}
                                feel={post.feel || {}}
                                privacy={post.privacy}
                                // friends_tagged={post.friends_tagged || []}
                                feelCount={{
                                    like: post.feelCount?.like || 0,
                                    haha: post.feelCount?.haha || 0,
                                    love: post.feelCount?.love || 0,
                                }}
                                comments={post.comments}
                                views={post.views}
                                post_link_meta={post.post_link_meta}
                            />

                        ))
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            {/* <aside className="w-[200px] hidden lg:block">
        <div className="sticky max-h-[calc(100vh-73px)] overflow-y-auto"> */}
            {/* <div className="flex flex-col space-y-0">
                <RightSidebar />
                <RightSidebar />
                <RightSidebar />
                <RightSidebar />
                <RightSidebar />
                <RightSidebar />
            </div>
            
            */}

            {/* </div>
      </aside> */}
        </div>
    );
};

export default Home;
