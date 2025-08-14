// src/types/index.ts

import { PaginatedResponse, PostFromServer, PostResponse } from "../posts/type";

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  
}

export interface GetPostUserParams {
  limit?: number;
    page: number;
    
    onSuccess?: (data: PaginatedResponse<PostFromServer>) => void;
    onError?: (msg: string) => void;
    onFinally?: () => void;
}

export interface CommentType {
    id: number;
    avatarUrl: string;
    name: string;
    text: string;
    sticker?: string;
}


