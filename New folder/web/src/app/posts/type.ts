/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserInfo } from "../home/type";


// Dùng cho component hiển thị bài viết (PostCard)
export interface PostCardProps {
  userName: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  stats: {
    like: number;
    comment: number;
    view: number;
  };
  createdAt: string;
  post_link_meta?: PostLinkMeta
}

// Props truyền vào CreatePostModal
// export interface CreatePostModalProps {
//   open: boolean;
//   userInfo: UserInfo;
//   onClose: () => void;
//   onPostCreated: (newPost: PostData) => void;
// }


// Post types


// Post dùng trong client (local state)

// Post trả về từ server 
export interface PostFromServer {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
  images?: string[];
  videos?: string[];
  privacy: 'public' | 'friends';
  post_link_meta?: PostLinkMeta;
  likesCount?: number;
  commentsCount?: number;


}



// Gửi lên server để tạo bài viết


export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
  videos?: string[];
  privacy: 'public' | 'friends';
  userId: string;
  likesCount: number;
  commentsCount: number;
}


export interface CreatePostModalProps {
  open: boolean;
  userInfo: UserInfo;
  onClose: () => void;
  onPostCreated: (newPost: PostResponse) => void;
}

export interface ExtractLinkParams {
  url: string;
  onSuccess?: (meta: PostLinkMeta) => void;
  onError?: (msg: string) => void;
}

export interface PostLinkMeta {
  post_link_url?: string;
  post_link_title?: string;
  post_link_description?: string;
  post_link_content?: string;
  post_link_image?: string;
}

export interface CreatePostParams {
  data: {
    title?: string;
    content?: string;
    privacy?: string;
    userId: string;
    images?: File[] | null;
    videos?: File[] | null;
    post_link_meta?: PostLinkMeta | null;
    hashtags?: string[];
    likeCount?: number;
    commentsCount?: number;
  };
  onSuccess?: (res: PostResponse) => void;
  onError?: (error: string) => void;
}

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  privacy: string;
  images?: string[];
  videos?: string[];
  post_link_meta?: PostLinkMeta;
  userId: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentsCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}