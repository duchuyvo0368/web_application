/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { saveUserToLocalStorage } from '../../utils/authStorage';

const API_CONFIG = "http://localhost:5000/v1/api"

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
    const res = await axios.post(`${API_CONFIG}/auth/login`, data);
    saveUserToLocalStorage(res.data.metadata?.user);
    onSuccess?.(res.data);

  } catch (err: any) {
    onError?.(err.response?.data || err);
  }
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};