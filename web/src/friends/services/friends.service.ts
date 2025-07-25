import axios from 'axios';

const API_CONFIG = process.env.API_CONFIG || 'http://localhost:5000/v1/api';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
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

        const res = await axios.get(`${API_CONFIG}/friends?type=all&limit=${limit}`, {
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
    onSuccess,
    onError,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/update-status`,
            {
                userId,
                type: "send"
            },
            {
                headers:getAuthHeaders()
            }

        );

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};
export const unFriend = async ({
    userId,
    onSuccess,
    onError,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
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
};
