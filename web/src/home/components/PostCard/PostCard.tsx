// import React, { useRef } from 'react';
// import styles from './PostCard.module.css';
// import VerifiedIcon from '@mui/icons-material/Verified';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import LinkPreviewSkeleton from './LinkPreviewSkeleton';

// interface PostCardProps {
//   avatar: string;
//   user: [string, string];
//   time: string;
//   title: string;
//   content: string;
//   images: string[];
//   stats: {
//     like: number;
//     comment: number;
//     view: number;
//   };
//   post_link_meta?: {
//     post_link_url: string;
//     post_link_title: string;
//     post_link_description: string;
//     post_link_image?: string;
//   };
// }

// const isVideo = (url: string) => {
//   return url?.endsWith('.mp4') || url?.endsWith('.webm') || url?.endsWith('.ogg');
// };

// const PostCard: React.FC<PostCardProps> = ({
//   avatar,
//   user,
//   time,
//   title,
//   content,
//   images,
//   stats,
//   post_link_meta,
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const linkUrl = post_link_meta?.post_link_url || '';
//   const linkTitle = post_link_meta?.post_link_title || '';
//   const linkDescription = post_link_meta?.post_link_description || '';
//   const linkImage = post_link_meta?.post_link_image || '';

//   const isMetaLoading = false;

//   const formatHashtags = (text: string) => text;

//   return (
//     <div className="flex justify-center w-full px-4">
//       <div className={styles.card + ' "w-full max-w-2xl'}>
//         {/* Header */}
//         <div className={styles.header + ' gap-3 pb-2 border-b border-gray-100'}>
//           <img src={avatar} alt="avatar" className={styles.avatar + ' border-2 border-blue-200 shadow'} />
//           <div>
//             <div className={styles.username + ' flex items-center gap-1'}>
//               {user[1]}
//               <VerifiedIcon style={{ width: '10px', height: '10px' }} />

//             </div>
//             <div className={styles.time}>{time}</div>
//           </div>
//         </div>

//         {/* Title */}
//         <div className={styles.title}>{title}</div>

//         {/* Content */}
//         {!post_link_meta && (
//           <div
//             className={styles.content}
//             dangerouslySetInnerHTML={{ __html: formatHashtags(content) }}
//           />
//         )}

//         {/* Link preview */}
//         {isMetaLoading ? (
//           <LinkPreviewSkeleton />
//         ) : post_link_meta && (
//           <a
//             href={linkUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.linkPreview + ' hover:shadow-lg transition'}
//           >
//             <div className={styles.linkPreviewImageWrapper}>
//               {linkImage && /^https?:\/\//.test(linkImage.trim()) && (
//                 <img src={linkImage} alt={linkTitle} className={styles.linkPreviewImage} />
//               )}
//             </div>
//             <div className={styles.linkPreviewContent}>
//               <div className={styles.linkPreviewTitle}>{linkTitle}</div>
//               <div className={styles.linkPreviewDesc}>{linkDescription}</div>
//               <div className={styles.linkPreviewUrl}>{linkUrl}</div>
//             </div>
//           </a>
//         )}

//         {/* Image & Video Preview */}
//         {!post_link_meta && images?.length > 0 && (
//           <div className="grid gap-3 mt-2">
//             {images.map((url, idx) => {
//               const isVid = isVideo(url);
//               return (
//                 <div key={idx} className="relative">
//                   {isVid ? (
//                     <video
//                       ref={idx === 0 ? videoRef : null}
//                       src={url}
//                       controls
//                       style={{ width: '100%' }}
//                       className="w-full rounded-lg max-h-[220px] object-cover border border-gray-200"
//                     />
//                   ) : (
//                     <img
//                       src={url}
//                       alt={`img-${idx}`}
//                       className="w-full rounded-lg object-contain border border-gray-200"
//                       style={{ maxHeight: '220px' }}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Stats */}
//         <div className={styles.stats + ' flex items-center gap-4 text-xs text-gray-400 mt-2 mb-1'}>
//           <span className="flex items-center gap-1">
//             <FavoriteIcon className="text-pink-500 w-4 h-4" fontSize="small" />
//             {stats.like} lượt thích
//           </span>
//           <span className="flex items-center gap-1">
//             <ChatBubbleOutlineIcon className="text-blue-400 w-4 h-4" fontSize="small" />
//             {stats.comment} bình luận
//           </span>
//           <span className="flex items-center gap-1">
//             <VisibilityIcon className="text-gray-400 w-4 h-4" fontSize="small" />
//             {stats.view} lượt xem
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostCard;

import React from 'react';
import { UserInfo } from '../../types'; // Import UserInfo for correct typing

interface PostCardProps {
  avatar: string;
  user: [string, string]; // [userId, userName]
  time: string;
  title: string;
  content: string;
  images: string[];
}

const PostCard: React.FC<PostCardProps> = ({ avatar, user, time, title, content, images }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <img src={avatar} alt="user avatar" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold">{user[1]}</p>
          <p className="text-sm text-gray-500">{new Date(time).toLocaleString()}</p>
        </div>
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p>{content}</p>
      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <img key={i} src={img} className="w-24 h-24 object-cover rounded" alt="post content" />
        ))}
      </div>
    </div>
  );
};

export default PostCard;
