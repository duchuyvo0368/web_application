/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserInfo } from "../home/type";




// Dùngd cho component hiển thị bài viết (PostCard)
export interface PostCardProps {
    postId: string;
    userName: string;
    avatar: string;
    time: string;
    title: string;
    content: string;
    images: string[];
    hashtags: string[];
    videos: string[];
    feel: { [userId: string]: 'like' | 'love' | 'haha' };
    feelCount: { [key: string]: number };
    comments: number;
    views: number;
    createdAt: string;
    post_link_meta?: PostLinkMeta
}
export interface CreateMultipartResponse {
    uploadId: string;
    key: string;
}

export interface PresignedUrlResponse {
    url: string;
}

export interface UploadPart {
    ETag: string;
    PartNumber: number;
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
    _id: string;
    title: string;
    content: string;
    hashtags?: string[];
    createdAt: string;
    userId: string;
    images?: string[];
    videos?: string[];
    privacy: 'public' | 'friends';
    post_link_meta?: PostLinkMeta;
    feelCount: { [key: string]: number };
    feel: { [userId: string]: 'like' | 'love' | 'haha' };
    comments: number;
    views: number;

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
    hashtags?: string[];
    feel?: { [key: string]: string };
    feelCount?: { [key: string]: number };
    comments: number;
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
        images?: string[] | null;
        videos?: string[] | null;
        post_link_meta?: PostLinkMeta | null;
        hashtags?: string[];
        feelCount?: { [key: string]: number };
        feel?: { [key: string]: string };
        comments?: number;
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
    hashtags?: string[];
    createdAt: string;
    updatedAt: string;
    feelCount: { [key: string]: number };
    feel: { [key: string]: string };
    comments: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}