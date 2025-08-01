// For shared interfaces/types
export interface UserInfo {
  _id: string;
  name: string;
  avatar: string;
}

export interface Post {
  _id: string;
  userId: UserInfo;
  createdAt: string;
  title: string;
  content: string;
  images: string[];
  likesCount?: number;
  commentsCount?: number;
  view?: number;
  post_link_meta?: any;
}