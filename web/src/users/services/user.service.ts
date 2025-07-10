import axios from 'axios';

const API_CONFIG = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api';

export const getAllUser = async ({
    limit,
    onSuccess,
    onError,
}: {
    limit?: number;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/users`, {
            params: { limit },
            withCredentials: true, 
        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};
export const addFriend = async ({
    toUser,
    onSuccess,
    onError,
}: {
    toUser: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/request`,
            { toUser },
            {
                withCredentials: true,
            }
        );

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};

export const addFollow = async ({
    toUser,
    onSuccess,
    onError,
}: {
    toUser: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.patch(`${API_CONFIG}/users/follow/${toUser}`,
            {},
            {
                withCredentials: true,
            }
        );

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};