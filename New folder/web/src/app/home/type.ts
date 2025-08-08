// src/types/index.ts

import { PaginatedResponse, PostFromServer, PostResponse } from "../posts/type";

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  // Thêm các field khác nếu cần
}

export interface GetPostUserParams {
  limit?: number;
    pages: number;
    
    onSuccess?: (data: PaginatedResponse<PostFromServer>) => void;
    onError?: (msg: string) => void;
    onFinally?: () => void;
}



