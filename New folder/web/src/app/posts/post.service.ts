import { getAuthHeaders } from './../../utils/index';
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import pLimit from 'p-limit';
import {
    PaginatedResponse,
    PostFromServer,
    ExtractLinkParams,
    PostLinkMeta,
 
} from './type';
import { getUploadConfig } from '@/utils/constants';

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



export const createPost = async ({
    data,
    onSuccess,
    onError,
}: {
    data: {
        title: string;
        content: string;
        privacy?: string;
        userId: string;
        images?: string[]; // chỉ nhận URL
        videos?: string[]; // chỉ nhận URL
        hashtags?: string[];
        post_link_meta?: any;
        post_count_feels?: {
            post_count_feels: number;
            post_count_comments: number;
            post_count_views: number;
        };
        feel?: { [key: string]: string };
        feelCount?: { [key: string]: number };
    };
    onSuccess?: (res: any) => void;
    onError?: (err: string) => void;
}) => {
    try {
        const res = await api.post('/posts/create', data, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        console.log("logger:", res);
        onSuccess?.(res.data);
    } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Failed to create post';
        onError?.(message);
    }
};




//Upload



// utils/upload.ts
export const sliceFileIntoChunks = (file: File, size: number): Blob[] => {
    const chunks: Blob[] = [];
    let offset = 0;
    while (offset < file.size) {
        chunks.push(file.slice(offset, offset + size));
        offset += size;
    }
    return chunks;
};


export const uploadFileInChunks = async (file: File, onProgress?: (percent: number) => void) => {
    const initRes = await api.post('/upload/create-multipart', {
        fileName: file.name,
        contentType: file.type,
    });
    const { uploadId, key } = initRes.data;
    const { chunkSize, parallelLimit } = getUploadConfig(file.size);
    const chunks = sliceFileIntoChunks(file, chunkSize);
    const limit = pLimit(parallelLimit);
    const parts: { ETag: string; PartNumber: number }[] = [];
    let uploadedCount = 0;

    await Promise.all(chunks.map((chunk, index) =>
        limit(async () => {
            const partNumber = index + 1;

            // Retry logic
            const MAX_RETRY = 3;
            for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
                try {
                    const presignedRes = await api.get('/upload/presigned-url', {
                        params: { uploadId, key, partNumber, contentType: file.type },
                    });
                    const url = presignedRes.data.url;

                    const uploadRes = await fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': file.type },
                        body: chunk,
                    });

                    const eTag = uploadRes.headers.get('ETag');
                    if (!eTag) throw new Error(`Missing ETag for part ${partNumber}`);

                    parts[partNumber - 1] = {
                        ETag: eTag.replace(/"/g, ''),
                        PartNumber: partNumber,
                    };

                    uploadedCount++;
                    onProgress?.(Math.round((uploadedCount / chunks.length) * 100));
                    return;
                } catch (err) {
                    if (attempt === MAX_RETRY - 1) throw err;
                    await new Promise((res) => setTimeout(res, 500));
                }
            }
        })
    ));

    const completeRes = await api.post('/upload/complete-multipart', {
        key,
        uploadId,
        parts,
    });

    return { location: completeRes.data.location };
};



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


export async function updatePostFeel({
    postId,
    feel,
}: {
    postId: string;
    feel: string | ""
}) {
    try {
        const res = await api.post(
            `/posts/${postId}/feel`,
            { feel },
            {
                headers: getAuthHeaders(),
            }
        );

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update feel');
    }
}


export const getFriends = async ({
    limit,
    onSuccess,
    onError,
}: {
    limit?: number;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {

        const res = await api.post(`/friends?type=all&limit=${limit}`, {
            headers: getAuthHeaders()
        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};