import { metadata } from './../../../../../web/src/app/layout';
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import {
    PaginatedResponse,
    PostFromServer,
    

} from '../posts/type';
import { GetPostsParams } from './type';
const API_CONFIG = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api';
const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
export const getAllUser = async ({
    limit,
    page,
    onSuccess,
    onError,
}: {
    limit?: number;
    page?: number
    onSuccess?: (data: any) => void;
        onError?: (err: any) => void;
    
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/user/all?limit=${limit}&page=${page}`, {


            headers: getAuthHeaders()

        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};
export const addFriend = async ({
    userId,
    type = "send",
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    type?: "send" ;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type
            },
            {
                headers: getAuthHeaders()
            })

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};
export const acceptFriend = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type:"accept"
            },
            {
                headers: getAuthHeaders()
            })

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};

export const rejectFriend = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type: "reject"
            },
            {
                headers: getAuthHeaders()
            })

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};
export const addFollow = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type: "follow"
            },
            {
                headers: getAuthHeaders()
            })

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};
export const unFollow = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type: "unfollow"
            },
            {
                headers: getAuthHeaders()
            })

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};

export const getProfile = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    type?: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/user/profile/${userId}`, {
            headers: getAuthHeaders()
        });


        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};


export const uploadFile = async ({
    type,
    file,
    onSuccess,
    onError,
    onFinally,
}: {
    type: string;
    file: File;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${API_CONFIG}/user/upload-avatar`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('upload_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};


export const cancelRequest = async ({ userId, onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type: "deleted"
            },
            {
                headers: getAuthHeaders()
            })


        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};

export const unFriend = async ({
    userId,
    onSuccess,
    onError,
    onFinally,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,{
            userId,
            type: "unfriend"
        },
        {
            headers:getAuthHeaders()
        })
        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
    finally {
        onFinally?.();
    }
};




export const getPostByUser = async ({
    limit = 10,
    pages,
    userId,
    onSuccess,
    onError,
    onFinally,
}: GetPostsParams): Promise<void> => {
    try {
        const res = await axios.get<PaginatedResponse<PostFromServer>>(`${API_CONFIG}/posts/user?userId=${userId}`, {
            params: { limit, page: pages },
            headers: getAuthHeaders(),
        });
        onSuccess?.(res.data);
    } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Failed to fetch posts';
        console.error('Error fetching posts:', message);
        onError?.(message);
    }
    finally {
        onFinally?.();
    }
};
    