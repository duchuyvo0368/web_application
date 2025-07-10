export interface IUFollowRepository {
    getFollowById(id: string): Promise<any>;
    getFollowByUserId(userId: string): Promise<any>;
    createFollow(fromUser: string, toUser: string): Promise<any>;
    deleteFollow(fromUser: string, toUser: string): Promise<any>;
    getAllFollowers(userId: string): Promise<any>;
    getAllFollowing(userId: string): Promise<any>;
}