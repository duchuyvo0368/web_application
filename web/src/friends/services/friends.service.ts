/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getUserFromLocalStorage } from '../../utils/authStorage';


const API_CONFIG = 'http://localhost:5000/v1/api';

export const getMutualFriend = async ({
  limit,
  onSuccess,
  onError,
}: {
  limit?: number;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) => {
  try {
    const user = getUserFromLocalStorage();
    if (!user?.id) throw new Error('User chưa đăng nhập');

    const res = await axios.get(`${API_CONFIG}/mutual-friend`, {
      params: {
        userId: user.id,
        limit,
      },
    });
    console.log("data_res",res)
    onSuccess?.(res.data);
  } catch (err: any) {
    onError?.(err.response?.data || err.message || err);
  }
};
