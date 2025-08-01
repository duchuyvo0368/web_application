/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import {
  CreatePostParams,
  PaginatedResponse,
  PostFromServer,
  PostResponse,
  ExtractLinkParams,
  PostLinkMeta,
} from './type';
import { getAuthHeaders } from '@/utils';

const api = axios.create({
  baseURL: process.env.API_CONFIG || 'http://localhost:5000/v1/api',
});


// danh sach post

interface GetPostsParams {
  limit?: number;
  pages: number;
  onSuccess?: (res: PaginatedResponse<PostFromServer>) => void;
  onError?: (msg: string) => void;
}

export const getPostUser = async ({
  limit = 10,
  pages,
  onSuccess,
  onError,
}: GetPostsParams): Promise<void> => {
  try {
    const res = await api.get<PaginatedResponse<PostFromServer>>('/posts', {
      params: { limit, page: pages },
      headers: getAuthHeaders(),
    });
    onSuccess?.(res.data);
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Failed to fetch posts';
    console.error('Error fetching posts:', message);
    onError?.(message);
  }
};


// tao post

// ===============================
// Service: post.service.ts
// ===============================
export const createPost = async ({
  data,
  onSuccess,
  onError,
}: CreatePostParams): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('title', data.title?? '');
    formData.append('content', data.content?? '');
    formData.append('privacy', data.privacy || 'public');
    formData.append('userId', data.userId);

    // Append metadata nếu có
    if (data.post_link_meta && Object.keys(data.post_link_meta).length > 0) {
      formData.append('post_link_meta', JSON.stringify(data.post_link_meta));
    }

    // Append image files nếu có
    (data.images || []).forEach((img) => {
      if (img) formData.append('images', img);
    });

    // Append video files nếu có
    (data.videos || []).forEach((vid) => {
      if (vid) formData.append('videos', vid);
    });

    const res = await api.post<PostResponse>('/posts/create', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('res.data:', res.data);
    onSuccess?.(res.data);
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to create post';
    console.error('Error creating post:', {
      error: err,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
    });
    onError?.(errorMessage);
  }
};


// utils/uploadFiles.ts
// export  uploadPostFiles(files: File[]) {
//   const formData = new FormData();
//   files.forEach((file) => {
//     formData.append('files', file);
//   });

//   const res = await fetch('/api/upload-multipart', {
//     method: 'POST',
//     body: formData,
//     credentials: 'include',
//   });

//   if (!res.ok) {
//     throw new Error('Upload failed');
//   }

//   const data = await res.json();
//   return data.files as { url: string }[];
// }


// Extract metadata



export const extractLinkMetadata = async ({
  url,
  onSuccess,
  onError,
}: ExtractLinkParams): Promise<void> => {
  try {
    const res = await api.post<{ metadata: PostLinkMeta }>(
      '/posts/extract-link-metadata',
      { url },
      { headers: getAuthHeaders() }
    );
    onSuccess?.(res.data.metadata);
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Failed to extract link metadata';
    console.error('Error extracting metadata:', message);
    onError?.(message);
  }
};
