import React from 'react';
// Remove: import styles from './PostCard.module.css';

const PostCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-3 mb-3 w-full max-w-md mx-auto animate-pulse">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <div className="w-8 h-8 rounded-full bg-gray-200" />
      <div>
        <div className="w-20 h-3 bg-gray-200 rounded mb-1" />
        <div className="w-12 h-2 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="w-32 h-4 bg-gray-200 rounded my-2" />
    <div className="w-full h-3 bg-gray-100 rounded mb-2" />
    <div className="w-full h-24 bg-gray-200 rounded mb-2" />
    <div className="flex justify-between mt-2">
      <div className="w-10 h-2 bg-gray-100 rounded" />
      <div className="w-10 h-2 bg-gray-100 rounded" />
      <div className="w-10 h-2 bg-gray-100 rounded" />
    </div>
  </div>
);

export default PostCardSkeleton; 
export default PostCardSkeleton; 