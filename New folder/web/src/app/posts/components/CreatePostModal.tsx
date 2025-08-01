/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useRef, useState } from "react";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import { createPost } from "../post.service";
import { CreatePostModalProps } from "../type";

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
      await createPost({
        data: {
          title: postTitle,
          content: postContent,
          privacy,
          images: selectedImageFiles,
          videos: selectedVideoFiles,
          userId: userInfo.id,
          post_link_meta: null,
          hashtags: [],
          likeCount: 0,
          commentsCount: 0,
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
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
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
                  <option value="friends">Friends</option>
                </select>
              </div>
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter a title for your post"
            className="mt-4 w-full text-lg font-medium focus:outline-none placeholder-gray-500"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <textarea
            placeholder="What's on your mind?"
            className="mt-2 w-full resize-none outline-none text-base placeholder-gray-500"
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {/* Preview Images */}
          {/* Preview Images */}
          {selectedImageFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Photo selected</h4>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {selectedImageFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full rounded-lg max-h-40 object-cover"
                    />
                    <button
                      onClick={() =>
                        setSelectedImageFiles(prev =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
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
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {selectedVideoFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full rounded-lg max-h-40"
                    />
                    <button
                      onClick={() =>
                        setSelectedVideoFiles(prev =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white text-gray-600 hover:text-red-500 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
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
              { label: "Poll", icon: "📊" },
              { label: "Event", icon: "📅" },
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
                <div className="text-3xl">{item.icon}</div>
                <span className="mt-1 capitalize">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-b border-neutral-200 bg-white">
          <button onClick={handlePost} className="w-full bg-[#2E90FA] hover:bg-[#1B74E4] text-white font-semibold py-2 rounded-lg">
            Post
          </button>
        </div>

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
