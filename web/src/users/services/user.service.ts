import axios from 'axios';

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
    page?:number
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/user?limit=${limit}&page=${page}`, {
            
            
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
        })

        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};

export const addFollow = async ({
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
                type: "follow"
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
export const unFollow = async ({
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
                type: "unfollow"
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

export const profile = async ({
    userId,
    onSuccess,
    onError,
}: {
    userId: string;
    type?: string;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.get(`${API_CONFIG}/user/${userId}`, {
            headers: getAuthHeaders()
          });
          
          
        console.log('data_res', res);
        onSuccess?.(res.data);
    } catch (err: any) {
        onError?.(err.response?.data || err.message || err);
    }
};


export const uploadFile = async ({
    type,
    file,
    onSuccess,
    onError,
  }: {
    type: string;
    file: File;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
  }) => {
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('file', file);
  
      const res = await axios.post(`${API_CONFIG}/upload`, formData, {
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
  };
  