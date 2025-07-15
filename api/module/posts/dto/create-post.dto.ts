export class CreatePostDto {
    userId: string;
    title: string;
    status?: 'public' | 'private' | 'friend' | 'followers';
    images?: string[];
    commentsCount?: number;
    likesCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
