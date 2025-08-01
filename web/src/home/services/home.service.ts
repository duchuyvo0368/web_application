// import { AxiosError } from 'axios';
// import { api } from './api';

// interface ServiceCallbacks<T> {
//   onSuccess?: (data: T) => void;
//   onError?: (error: string) => void;
// }

// interface GetPostsParams extends ServiceCallbacks<PaginatedResponse<PostResponse>> {
//   limit?: number;
//   pages: number;
// }

// interface ExtractLinkParams extends ServiceCallbacks<{ metadata: PostLinkMetadata }> {
//   url: string;
// }

// interface CreatePostParams extends ServiceCallbacks<{ data: PostResponse }> {
//   data: FormData;
// }
// export const getPostUser = async ({ 
//   limit = 10, 
//   pages, 
//   onSuccess, 
//   onError 
// }: GetPostsParams): Promise<void> => {
//   try {
//     const response = await api.get<PaginatedResponse<PostResponse>>('/posts', {
//       params: {
//         limit,
//         page: pages
//       }
//     });

//     onSuccess?.(response.data);
//   } catch (error) {
//     const errorMessage = error instanceof AxiosError 
//       ? error.response?.data?.message || error.message
//       : 'An unexpected error occurred';
    
//     console.error('Error fetching posts:', errorMessage);
//     onError?.(errorMessage);
//   }
// };

// export const getUserInfoMock = (): UserInfo => {
//   return { _id: 'u2', name: 'John Smith', avatar: 'https://placehold.co/40x40/333333/EFEFEF?text=JS' };
// };
// export const extractLinkMetadata = async ({ 
//   url, 
//   onSuccess, 
//   onError 
// }: ExtractLinkParams): Promise<void> => {
//   try {
//     const response = await api.post<{ metadata: PostLinkMetadata }>(
//       '/posts/extract-link-metadata', 
//       { url }
//     );
    
//     onSuccess?.(response.data);
//   } catch (error) {
//     const errorMessage = error instanceof AxiosError 
//       ? error.response?.data?.message || error.message
//       : 'Failed to extract link metadata';
    
//     console.error('Error extracting link metadata:', errorMessage);
//     onError?.(errorMessage);
//   }
// };


// export const createPost = async ({ 
//   data, 
//   onSuccess, 
//   onError 
// }: CreatePostParams): Promise<void> => {
//   try {
//     const response = await api.post<{ data: PostResponse }>(
//       '/posts/create', 
//       data,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );

//     onSuccess?.(response.data);
//   } catch (error) {
//     const errorMessage = error instanceof AxiosError 
//       ? error.response?.data?.message || error.message
//       : 'Failed to create post';
    
//     console.error('Error creating post:', errorMessage);
//     onError?.(errorMessage);
//   }
// };
import { Post, UserInfo } from '../types';

interface GetPostsResponse {
  data: Post[];
}

interface GetPostsOptions {
  onSuccess: (response: GetPostsResponse) => void;
  onError?: (error: string) => void;
}

export const getPosts = ({ onSuccess, onError }: GetPostsOptions) => {
  // Mock API call to simulate fetching posts from a backend
  setTimeout(() => {
    try {
      // Simulate success with mock data
      const mockPosts: Post[] = [
        { 
          _id: '1', 
          userId: { _id: 'u1', name: 'Jane Doe', avatar: 'https://placehold.co/40x40/EFEFEF/333333?text=JD' }, 
          createdAt: new Date('2025-07-29T10:00:00Z').toISOString(),
          title: 'First Post', 
          content: 'Hello world! This is my first post on this new platform. Excited to share my journey here.', 
          images: [] 
        },
        { 
          _id: '2', 
          userId: { _id: 'u3', name: 'Alice Wonderland', avatar: 'https://placehold.co/40x40/ABCDEF/333333?text=AW' }, 
          createdAt: new Date('2025-07-28T14:30:00Z').toISOString(),
          title: 'Exploring React Hooks', 
          content: 'Dive deep into React hooks and component patterns. Learning every day and loving it! #React #FrontendDev', 
          images: ['https://placehold.co/100x100?text=React', 'https://placehold.co/100x100?text=Hooks'] 
        },
        {
          _id: '3',
          userId: { _id: 'u4', name: 'Bob The Builder', avatar: 'https://placehold.co/40x40/FFCCEE/555555?text=BB' },
          createdAt: new Date('2025-07-27T08:15:00Z').toISOString(),
          title: 'Morning Run',
          content: 'Another great morning run! The weather in Da Nang is perfect today. Stay active everyone!',
          images: ['https://placehold.co/100x100?text=Run']
        }
      ];
      onSuccess({ data: mockPosts });

      // Uncomment the line below to test error state
      // throw new Error('Network error: Could not connect to server.');

    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    }
  }, 1000); // Simulate 1 second network delay
};

// You might also add a mock service for user info if it's fetched from an API
export const getUserInfoMock = (): UserInfo => {
  return { _id: 'u2', name: 'John Smith', avatar: 'https://placehold.co/40x40/333333/EFEFEF?text=JS' };
};