/* eslint-disable @next/next/no-img-element */
import React, { useRef } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkPreviewSkeleton from './LinkPreviewSkeleton';
import { PostCardProps } from '../type';

const isVideo = (url: string) =>
  url?.endsWith('.mp4') || url?.endsWith('.webm') || url?.endsWith('.ogg');

const PostCard: React.FC<PostCardProps> = ({
  userName,
  avatar,
  title,
  content,
  images = [],
  videos = [],
  stats,
  post_link_meta,
  createdAt,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const formatHashtags = (text: string) => text;

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-xl p-4 shadow-sm mb-6">
        {/* Header */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
          <img
            src={avatar || '/images/user-image.png'}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-blue-200 shadow object-cover"
          />
          <div>
            <div className="flex items-center gap-1 font-semibold text-sm">
              {userName || 'Unknown'}
              <VerifiedIcon className="w-2 h-2 text-blue-500" style={{ width: '15px', height: '15px' }} />
            </div>
            <div className="text-xs text-gray-500">{formatDate(createdAt)}</div>
          </div>
        </div>

        {/* Title */}
        {title && <div className="font-bold text-base my-2">{title}</div>}

        {/* Content */}
        {content && !post_link_meta && (
          <div
            className="text-sm text-gray-700 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: formatHashtags(content) }}
          />
        )}

        {/* Link preview */}
        {post_link_meta ? (
          <a
            href={post_link_meta.post_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex border border-gray-200 mt-3 rounded-lg overflow-hidden hover:shadow-sm transition"
          >
            {post_link_meta.post_link_image && /^https?:\/\//.test(post_link_meta.post_link_image.trim()) && (
              <div className="w-1/3 max-h-32 overflow-hidden">
                <img
                  src={post_link_meta.post_link_image}
                  alt={post_link_meta.post_link_title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-3 flex flex-col justify-between w-2/3">
              <div className="text-sm font-semibold text-gray-800 line-clamp-2">
                {post_link_meta.post_link_title}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">{post_link_meta.post_link_description}</div>
              <div className="text-xs text-blue-500 truncate">{post_link_meta.post_link_url}</div>
            </div>
          </a>
        ) : null}

        {/* Media: Images + Videos */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="grid gap-3 mt-3">
            {[...images, ...videos].map((url, idx) => {
              const isVid = isVideo(url);
              return (
                <div key={idx} className="relative">
                  {isVid ? (
                    <video
                      ref={idx === 0 ? videoRef : null}
                      src={url}
                      controls
                      className="w-full rounded-lg max-h-[300px] object-cover border border-gray-200"
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      className="w-full rounded-lg object-contain border border-gray-200 max-h-[300px]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span className="flex items-center gap-1">
            <FavoriteIcon className="text-pink-500 w-4 h-4" fontSize="small" />
            {stats?.like ?? 0} likes
          </span>
          <span className="flex items-center gap-1">
            <ChatBubbleOutlineIcon className="text-blue-400 w-4 h-4" fontSize="small" />
            {stats?.comment ?? 0} comments
          </span>
          <span className="flex items-center gap-1">
            <VisibilityIcon className="text-gray-400 w-4 h-4" fontSize="small" />
            {stats?.view ?? 0} views
          </span>
        </div>

      </div>
    </div>
  );
};

export default PostCard;
