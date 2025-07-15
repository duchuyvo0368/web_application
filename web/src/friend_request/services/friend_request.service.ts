import axios from 'axios';

const API_CONFIG = process.env.API_CONFIG || 'http://localhost:5000/v1/api';

//list xac nhan ban be
export const getFriendPending = async ({
    onSuccess,
    onError,
}: {
    limit?: number;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/friends/list/pending`, {
            withCredentials: true,
        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};

// Chấp nhận yêu cầu kết bạn
export const acceptFriendRequest = async ({ userId, onSuccess,
    onError,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/requests/${userId}/action/accept`,{}, {
            withCredentials: true,
        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};
// Từ chối yêu cầu kết bạn
export const rejectFriendRequest = async({ userId, onSuccess, 
    onError,
}: {
    userId: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/friends/requests/${userId}/action/reject`,{}, {
            withCredentials: true,
        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
}
