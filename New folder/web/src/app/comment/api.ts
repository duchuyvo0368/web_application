
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getAuthHeaders } from '@/utils';


const API_CONFIG = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api';
export const getPostById = async ({
    postId,
    onSuccess,
    onError,
    onFinally,
}: {
    postId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
    onFinally?: () => void;
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/post/${postId}`, {
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
