import { CommentType, UserInfo } from "../home/type";
import { PostLinkMeta } from "../posts/type";

export interface PostCommentModalProps {
    open: boolean;
   
    onClose: () => void;
    postData:PostData
   
}
export interface PostData {
    id: string;
    userInfo: { name: string; avatar: string };
    content: string;
    hashtags?: string[];
    privacy?: 'public' | 'friend';
    images: string[];
    videos?: string[];
    feel?: { [userId: string]: 'like' | 'love' | 'haha' };
    feelCount?: { [key: string]: number };
    views?: number;
    comments?: CommentType[];
    createdAt: string;
    post_link_meta?: PostLinkMeta | null;
    onNewComment?: (comment: CommentType) => void; // callback nếu muốn parent nhận comment mới
}