import { PaginatedResponse, PostFromServer } from "../posts/type";

export interface GetPostsParams {
    limit?: number;
    pages: number;
    userId: string;
    onSuccess?: (res: PaginatedResponse<PostFromServer>) => void;
    onError?: (msg: string) => void;
    onFinally?: () => void;
}
