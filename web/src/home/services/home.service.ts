import axios from 'axios';

const API_CONFIG = process.env.API_CONFIG || 'http://localhost:5000/v1/api';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
export const getPostUser = async ({
    limit,
    pages,
    onSuccess,
    onError,
}: {
    limit?: number;
    pages:number;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {

        const res = await axios.get(`${API_CONFIG}/posts/all?limit=${limit}&page=${pages}`, {
            headers: getAuthHeaders()
        });

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};

