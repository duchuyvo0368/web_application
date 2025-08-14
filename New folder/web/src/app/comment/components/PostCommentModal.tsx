/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, Smile, Camera, Sparkles, LoaderCircle, MoreHorizontal, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import CommentItem from './Comment';
import { CommentType } from '@/app/home/type';
import { PostCommentModalProps } from '../type';

const PostCommentModal: React.FC<PostCommentModalProps> = ({
    open,
    onClose,
    postData,
}) => {
    const [comments, setComments] = useState<CommentType[]>(postData?.comments || []);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (open) {
            // Khi modal mở, set lại comments từ postData
            setComments(postData?.comments || []);
        }
    }, [open, postData]);

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;

        const newCmt: CommentType = {
            id: Date.now().toString(),
            userId: 'me',
            userName: 'You',
            avatar: 'https://placehold.co/40x40/D1D5DB/333333?text=Me&font=sans',
            content: newComment,
            createdAt: new Date(),
        };

        setComments(prev => [newCmt, ...prev]);
        setNewComment('');
        // Gọi callback nếu muốn parent update
        postData.onNewComment?.(newCmt);
    };
    const thumbRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!postData?.images?.length) return null;

    const images = postData.images;
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-neutral-50/60 flex justify-center items-center z-50">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="relative p-4 border-b border-gray-200 flex items-center justify-center">
                    <h2 className="font-bold text-center text-black text-base">Bài viết</h2>
                    <button onClick={onClose} className="absolute right-4 text-gray-500 hover:text-gray-800">✕</button>
                </div>
                
                {/* Post content */}
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={postData.userInfo.avatar} alt="User Avatar" width={35} height={35} className="rounded-full w-9 h-9" />
                            <div className="ml-2">
                                <p className="font-semibold text-sm text-gray-800">{postData.userInfo.name}</p>
                                <p className="text-xs text-gray-500">32 phút trước</p>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><MoreHorizontal size={15} /></button>
                    </div>
                    <div className="p-4">
                        {/* Ảnh chính + thumbnail đè lên */}
                        <div className="relative w-full">
                            {/* Ảnh chính */}
                            <img
                                src={images[selectedIndex]}
                                alt={`Main post image`}
                                className="w-full max-h-[400px] object-cover rounded-lg"
                            />

                            {/* Thanh thumbnail đè lên ảnh */}
                            <div className="custom-indicator max-w-[230px] !flex flex-row items-center justify-start mb-3 p-1 absolute left-[50%] translate-x-[-50%] bottom-0 bg-gray-100/50 rounded-lg slick-thumb z-[21]">
                                {/* Nút prev */}
                                <button
                                    onClick={() => {
                                        setSelectedIndex((prev) => Math.max(0, prev - 1));
                                        thumbRef.current?.scrollBy({ left: -200, behavior: "smooth" });
                                    }}
                                    disabled={selectedIndex === 0}
                                    className="bg-white/80 hover:bg-white text-gray-800 shadow-lg rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {/* Danh sách ảnh nhỏ */}
                                <div
                                    ref={thumbRef}
                                    className="flex gap-2 overflow-x-auto no-scrollbar mx-2"
                                    style={{ scrollBehavior: "smooth" }}
                                >
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            onClick={() => setSelectedIndex(index)}
                                            className={`w-10 h-10 rounded-lg object-cover flex-shrink-0 cursor-pointer transition-all border-2 ${selectedIndex === index
                                                    ? "border-blue-400 scale-105"
                                                    : "border-transparent"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Nút next */}
                                <button
                                    onClick={() => {
                                        setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
                                        thumbRef.current?.scrollBy({ left: 200, behavior: "smooth" });
                                    }}
                                    disabled={selectedIndex === images.length - 1}
                                    className="bg-white/80 hover:bg-white text-gray-800 shadow-lg rounded-full w-9 h-9 flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="px-4 py-2 flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center"><span className="bg-blue-500 p-1 rounded-full"><Heart size={12} className="text-white" fill="white" /></span><span className="ml-1.5">Bạn và 21 người khác</span></div>
                        <span>{comments.length} bình luận • 2 lượt chia sẻ</span>
                    </div>
                    <div className="flex justify-around py-1 border-t border-b border-gray-200 mx-4">
                        <button className="flex-1 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md p-2 transition-colors"><Heart size={15} /><span className="font-semibold text-sm">Thích</span></button>
                        <button className="flex-1 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md p-2 transition-colors"><MessageCircle size={15} /><span className="font-semibold text-sm">Bình luận</span></button>
                        <button className="flex-1 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md p-2 transition-colors"><Share2 size={15} /><span className="font-semibold text-sm">Chia sẻ</span></button>
                    </div>
                    {/* Reactions */}
                    

                    {/* Comment list */}
                    <div className="p-4 space-y-4">
                        {/* {loading ? (
                            <LoaderCircle className="animate-spin" size={24} />
                        ) : (
                            comments.map(c => <CommentItem key={c._id} comment={c} />)
                        )} */}
                    </div>
                    

                </div>
                
                {/* Comment input */}
                <form className="p-2 flex items-center border-t border-gray-200 bg-white  rounded-lg">
                    <img src={postData.userInfo.avatar} alt="Current User Avatar" width={35} height={35} className=" w-9 h-9 rounded-full" />
                    <div className="flex-1 ml-2">
                        <div className="relative">
                            <input type="text" placeholder="Viết bình luận..." className="w-full bg-gray-100 rounded-full py-2.5 pl-4 pr-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                                <button type="button" onClick={handleCommentSubmit} className="text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Sparkles size={15} className='w-5 h-5 rounded-full' />
                                </button>
                                <Smile size={15} className="text-gray-500 cursor-pointer w-5 h-5 rounded-full hover:text-gray-700" />
                                <Camera size={15} className="text-gray-500 cursor-pointer w-5 h-5 rounded-full hover:text-gray-700" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostCommentModal;
