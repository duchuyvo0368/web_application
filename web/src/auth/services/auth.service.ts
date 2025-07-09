import axios from 'axios';

const API_CONFIG = "http://localhost:5000/v1/api"; // ✅ Sửa: http://

interface LoginData {
    email: string;
    password: string;
}

export const login = async ({
    data,
    onSuccess,
    onError,
}: {
    data: LoginData;
    onSuccess?: (res: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/auth/login`, data, {
            withCredentials: true,
        });
        console.log("Login response:", res);
        onSuccess?.(res.data.metadata.shop);
    } catch (err: any) {
        onError?.(err.response?.data || err);
    }
};
