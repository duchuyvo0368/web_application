/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useRef, useState, useEffect } from "react";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import { createPost, extractLinkMetadata, searchFriendUsers, uploadFileInChunks } from "../post.service";
import { Loader2, SendHorizonal } from 'lucide-react';
import { CreatePostModalProps, PostLinkMeta } from "../type";
import { splitContentAndHashtags } from "@/utils";
import { UserInfo } from "@/app/home/type";

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    open,
    onClose,
    userInfo,
    onPostCreated,
}) => {
    if (!open) return null;

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [selectedVideoFiles, setSelectedVideoFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);
    const [linkMeta, setLinkMeta] = useState<PostLinkMeta | null>(null);
    const [mentionQuery, setMentionQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mentionSuggestions, setMentionSuggestions] = useState<any[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<any[]>([]);



    const fileRefs = {
        image: useRef<HTMLInputElement>(null),
        video: useRef<HTMLInputElement>(null),
    };

    const handleFileChange = (type: 'image' | 'video') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (type === 'image' && selectedVideoFiles.length > 0) return toast.error("Can't upload both images and videos");
        if (type === 'video' && selectedImageFiles.length > 0) return toast.error("Can't upload both images and videos");

        type === 'image'
            ? setSelectedImageFiles(prev => [...prev, ...files])
            : setSelectedVideoFiles(prev => [...prev, ...files]);
    };

    const triggerFileInput = (type: 'image' | 'video') => {
        fileRefs[type].current?.click();
    };


    const handlePost = async () => {

        try {
            setIsUploading(true);
            console.time("🖼️ Upload Images");
            const [imageUrls, videoUrls] = await Promise.all([
                Promise.all(
                    selectedImageFiles.map(file =>
                        uploadFileInChunks(file, (percent: any) =>
                            console.log(`Uploading image ${file.name}: ${percent}%`)
                        ).then((res: { location: any }) => res.location)
                    )
                ),
                Promise.all(
                    selectedVideoFiles.map(file =>
                        uploadFileInChunks(file, (percent: any) =>
                            console.log(`Uploading video ${file.name}: ${percent}%`)
                        ).then((res: { location: any }) => res.location)
                    )
                ),
            ]);
            console.timeEnd("🖼️ Upload Images");

            console.time("createPost");
            const { content: cleanContent, hashtags } = splitContentAndHashtags(postContent);
            console.log("logger:", cleanContent, hashtags);
            await createPost({
                data: {
                    title: postTitle,
                    content: cleanContent,
                    privacy,
                    userId: userInfo.id,
                    images: imageUrls,
                    videos: videoUrls,
                    hashtags: hashtags,
                    post_link_meta: linkMeta,
                    friends_tagged: selectedFriends.map(f => f.id),
                    post_count_feels: {
                        post_count_feels: 0,
                        post_count_comments: 0,
                        post_count_views: 0,
                    },
                },
                onSuccess: (newPost) => {
                    toast.success('Post created successfully!');
                    onPostCreated(newPost);
                    onClose();
                },
                onError: (error) => {
                    toast.error(`Failed to create post: ${error}`);
                },
            });
            console.timeEnd("createPost");
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Error creating post');
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setPostContent(value); // cập nhật nội dung bài post

        const cursorPosition = e.target.selectionStart;
        const lastAt = value.lastIndexOf('@', cursorPosition - 1);

        if (lastAt !== -1) {
            const spaceIndex = value.indexOf(' ', lastAt);
            const mentionKeyword = value.slice(
                lastAt + 1,
                spaceIndex === -1 ? undefined : spaceIndex
            );

            if (mentionKeyword.length > 0) {
                try {
                    const users = await searchFriendUsers({ name: mentionKeyword });
                    setMentionSuggestions(users);
                    console.log("logger:", users);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Search error:', err);
                    setMentionSuggestions([]);
                    setShowSuggestions(false);
                }
            } else {
                setMentionSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setMentionSuggestions([]);
            setShowSuggestions(false);
        }
    };








    useEffect(() => {
        const match = postContent.match(/(https?:\/\/[^\s]+)/);
        const url = match?.[0];
        if (!url) {
            setLinkMeta(null);
            return;
        }

        if (linkMeta?.post_link_url === url) return;

        setLinkLoading(true);
        extractLinkMetadata({
            url,
            onSuccess: (meta: PostLinkMeta) => {
                console.log("logger:", meta);
                setLinkMeta(meta);
                if (!postTitle) {
                    setPostTitle(meta.post_link_title ?? '');
                }
                setLinkLoading(false);
            },
            onError: () => {
                setLinkMeta(null);
                setLinkLoading(false);
            },
        });
    }, [postContent]);


    const highlightHashtags = (text: string) => {
        const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return escaped
            .replace(/#[\w\u00C0-\u1EF9]+/g, (tag) => {
                return `<span class="text-blue-500 font-medium">${tag}</span>`;
            })
            .replace(/@[\w\u00C0-\u1EF9]+(?: [\w\u00C0-\u1EF9]+)*/g, (tag) => {
                return `<span class="text-blue-500 font-medium">${tag}</span>`;
            });


    };
    const handleMentionSelect = (user: UserInfo) => {
        const newContent = postContent.replace(/@\w*$/, `@${user.name} `);
        setPostContent(newContent);
        setShowSuggestions(false);
        setMentionQuery("");

        setSelectedFriends(prev => {
            if (!prev.find(u => u.id === user.id)) {
                return [...prev, user];
            }
            return prev;
        });
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative bg-white w-full max-w-xl rounded-xl shadow-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="relative text-center p-4 border-b border-neutral-200 bg-white">
                    <p className="text-base font-bold text-[#2E90FA]">Create Post</p>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-8 py-4">
                    <div className="flex items-center gap-2 min-h-16">
                        <img src={userInfo.avatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold">{userInfo.name}</p>
                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                <Globe className="w-4 h-4" />
                                <select
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value as 'public' | 'friends')}
                                    className="bg-transparent text-sm outline-none cursor-pointer"
                                >
                                    <option value="public">Public</option>
                                    <option value="friend">Friends</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Title your article"
                        className="mt-4 w-full text-lg font-semibold text-gray-800 text-center placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                    />


                    <div className="relative w-full mt-2">
                        <div
                            className="absolute top-0 left-0 w-full h-full whitespace-pre-wrap text-base text-gray-900 pointer-events-none p-2"
                            dangerouslySetInnerHTML={{ __html: highlightHashtags(postContent) }}
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            className="w-full resize-none outline-none text-base placeholder-gray-500 bg-transparent relative z-10 p-2"
                            rows={4}
                            value={postContent}
                            onChange={(e) => {
                                setPostContent(e.target.value);
                                handleChange(e);
                            }}
                            style={{
                                color: "transparent",
                                caretColor: "black",
                            }}
                        />
                        {showSuggestions && mentionSuggestions.length > 0 && (
                            <ul className="absolute z-20 mt-1 left-2 top-full bg-white border border-gray-300 rounded shadow-md w-64 max-h-48 overflow-y-auto">
                                {mentionSuggestions.map(user => (
                                    <li
                                        key={user.id}
                                        onClick={() => handleMentionSelect(user)}
                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                                            <span>{user.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>


                    {linkLoading && (
                        <p className="text-sm text-gray-500">Loading...</p>
                    )}

                    {linkMeta && (
                        <div className="border border-gray-300 rounded p-2 mt-2 flex gap-3 items-center">
                            {linkMeta.post_link_image && (
                                <img
                                    src={linkMeta.post_link_image}
                                    alt="link preview"
                                    className="w-24 h-24 object-cover rounded"
                                />
                            )}
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm line-clamp-1">{linkMeta.post_link_title}</h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{linkMeta.post_link_description}</p>
                                <a
                                    href={linkMeta.post_link_url}
                                    className="text-blue-500 text-xs break-all inline-block mt-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {linkMeta.post_link_url}
                                </a>
                            </div>
                        </div>
                    )}




                    {/* Preview Images */}
                    {selectedImageFiles.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Photo selected</h4>
                            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                                {selectedImageFiles.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${idx}`}
                                            className="w-full rounded-md max-h-40 object-cover"
                                        />
                                        <button
                                            onClick={() =>
                                                setSelectedImageFiles(prev => prev.filter((_, i) => i !== idx))
                                            }
                                            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preview Videos */}
                    {selectedVideoFiles.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Video selected</h4>
                            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                                {selectedVideoFiles.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group bg-white/60 border border-dashed border-[#d9d9d9] rounded-lg p-1"
                                    >
                                        <video src={URL.createObjectURL(file)} controls className="w-full rounded-md max-h-40" />
                                        <button
                                            onClick={() =>
                                                setSelectedVideoFiles(prev => prev.filter((_, i) => i !== idx))
                                            }
                                            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}




                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-5 justify-items-center mt-6">
                        {[
                            { label: "image", icon: "🖼️" },
                            { label: "video", icon: "🎥" },
                            { label: "livestream", icon: "📡" },
                            { label: "mp3", icon: "🎵" },
                            { label: "document", icon: "📄" },
                            { label: "tag", icon: "🏷️" },
                            { label: "donate", icon: "🤝" },
                            { label: "poll", icon: "📊" },
                            { label: "event", icon: "📅" },
                            { label: "action", icon: "🔥" },
                            { label: "address", icon: "🏠" },
                            { label: "location", icon: "📍" },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() =>
                                    item.label === "image" || item.label === "video"
                                        ? triggerFileInput(item.label as 'image' | 'video')
                                        : null
                                }
                                className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-500 cursor-pointer w-16"
                            >
                                <div className="text-2xl">{item.icon}</div>
                                <span className="mt-1 capitalize text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Cách phần icon ra một đoạn lớn hơn */}
                    <div className="mt-10">
                        <button
                            onClick={handlePost}
                            disabled={isUploading}
                            className={`w-full relative flex items-center justify-center gap-2 py-2 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg
               ${isUploading
                                    ? 'bg-gradient-to-r from-blue-300 to-blue-500 cursor-not-allowed opacity-80'
                                    : 'bg-gradient-to-r from-[#2E90FA] to-[#1B74E4] hover:from-[#1B74E4] hover:to-[#1065d8] text-white'
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    <span className="text-white">Đang đăng...</span>
                                </>
                            ) : (
                                <>
                                    <SendHorizonal className="w-5 h-5 text-white" />
                                    <span>Đăng bài</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>

                {/* Footer */}


                {/* Hidden Inputs */}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileRefs.image}
                    className="hidden"
                    onChange={handleFileChange('image')}
                />
                <input
                    type="file"
                    accept="video/*"
                    multiple
                    ref={fileRefs.video}
                    className="hidden"
                    onChange={handleFileChange('video')}
                />
            </div>
        </div>
    );
};

export default CreatePostModal;


