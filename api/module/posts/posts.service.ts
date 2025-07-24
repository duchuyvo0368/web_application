import { PostsModule } from 'module/posts/posts.module';
import { Post, PostRelation } from './post.entity';
import { extractMetadata } from './../../utils/extractMetadata';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { logger } from 'utils/logger';
import { FriendService } from 'module/firends/friends.service';
import { Model, Types } from 'mongoose';

@ApiTags('Post')
@Injectable()
export class PostsService {
     constructor(
          @InjectModel(Post.name, 'MONGODB_CONNECTION')
          private postModel: Model<PostRelation>,
          private friendService: FriendService,
     ) { }

     async extractLinkMetadata(content: string) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const match = content.match(urlRegex);
          if (!match) return null;

          const url = match[0];
          return await extractMetadata(url);
     }
     private extractHashtags(content: string): string[] {
          const regex = /#(\w+)/g;
          const matches = [...content.matchAll(regex)];
          return matches.map((match) => match[1].toLowerCase()); // chuyển về lowercase để đồng nhất
     }

     async createPost(data: {
          userId: string;
          title: string;
          content: string;
          images?: string;
          post_link_meta?: string;
          privacy?: string;
          hashtags?: string;
     }) {
          let metadata = null;
          logger.info(`Incoming post data: ${JSON.stringify(data)}`);

          // if (data.post_link_meta) {
          //     logger.info(`Extracting metadata from: ${data.post_link_meta}`);
          //     metadata = await this.extractLinkMetadata(data.post_link_meta);
          // }

          const hashtags = this.extractHashtags(data.content);

          const created = await this.postModel.create({
               ...data,
               post_link_meta: metadata,
               hashtags,
          });

          return created;
     }

     // async getNewsFeedPosts(userId: string, page = 1, limit = 10) {
     //   const skip = (page - 1) * limit;

     //   const [friendIds, followIds] = await Promise.all([
     //     this.friendService.getFriendUserIds(userId),
     //     this.friendService.getFollowingUserIds(userId),
     //   ]);

     //   if (friendIds.length === 0 && followIds.length === 0) {
     //     return {
     //       data: [],
     //       pagination: {
     //         page,
     //         limit,
     //         totalItems: 0,
     //         totalPages: 0,
     //       },
     //     };
     //   }

     //   const query = {
     //     $or: [
     //       {
     //         userId: { $in: friendIds },
     //         privacy: { $in: ['public', 'friend'] },
     //       },
     //       {
     //         userId: { $in: followIds },
     //         privacy: 'public',
     //       },
     //       {
     //         userId: userId,
     //       },
     //     ],
     //   };

     //   const [posts, totalItems] = await Promise.all([
     //     this.postModel.find(query)
     //       .sort({ createdAt: -1 })
     //       .skip(skip)
     //       .limit(limit)
     //       .lean(),

     //     this.postModel.countDocuments(query),
     //   ]);

     //   const totalPages = Math.ceil(totalItems / limit);

     //   return {
     //     data: posts,
     //     pagination: {
     //       page,
     //       limit,
     //       totalItems,
     //       totalPages,
     //     },
     //   };
     // }



     //follow





     //friends and public



     async getFeedPosts(userId: string, page = 1, limit = 10) {
          const skip = (page - 1) * limit;

          const [friendIds, followIds] = await Promise.all([
               this.friendService.getFriendUserIds(userId),
               this.friendService.getFollowingUserIds(userId),
          ]);

          if ((!friendIds || friendIds.length === 0) && (!followIds || followIds.length === 0)) {
               throw new BadRequestException("You haven't followed or befriended anyone to view posts.");
          }

          const myPost = await this.postModel
               .findOne({
                    userId,
                    privacy: { $in: ['public', 'friend'] },
               })
               .sort({ createdAt: -1 })
               .populate('userId', 'name avatar')
               .lean();

          const relatedUserIds = [...new Set([...friendIds, ...followIds])].filter(id => id !== userId);

          const relatedQuery = {
               userId: { $in: relatedUserIds },
               $or: [
                    { userId: { $in: friendIds }, privacy: { $in: ['public', 'friend'] } },
                    { userId: { $in: followIds }, privacy: 'public' },
               ],
          };

          const friendAndFollowLimit = myPost ? limit - 1 : limit;

          const [relatedPosts, totalRelatedItems] = await Promise.all([
               this.postModel
                    .find(relatedQuery)
                    .sort({ createdAt: -1 })
                    .populate('userId', 'name avatar')
                    .skip(skip)
                    .limit(friendAndFollowLimit)
                    .lean(),
               this.postModel.countDocuments(relatedQuery),
          ]);

          const data = myPost ? [myPost, ...relatedPosts] : relatedPosts;

          const totalItems = totalRelatedItems + (myPost ? 1 : 0);

          return {
               data,
               pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
               },
          };
     }





     //bai viet theo id
     async getPostsByUser(id: string, userId: string, page = 1, limit = 10) {
          const skip = (page - 1) * limit;

          // Trường hợp 1: Xem chính mình
          if (id === userId) {
               const [data, totalItems] = await Promise.all([
                    this.postModel
                         .find({ userId: id })
                         .sort({ createdAt: -1 })
                         .skip(skip)
                         .limit(limit)
                         .lean(),
                    this.postModel.countDocuments({ userId: id }),
               ]);

               return {
                    data,
                    pagination: {
                         page,
                         limit,
                         totalItems,
                         totalPages: Math.ceil(totalItems / limit),
                    },
               };
          }

          // Kiểm tra xem id này có phải bạn bè không
          const isFriend = await this.friendService.getFriendUserIds(userId);

          // Là bạn bè
          if (!isFriend) {
               return this.getFeedPosts(id, page, limit);
          }

          // chỉ lấy bài viết public
          const query = {
               userId: id,
               privacy: 'public',
          };

          const [data, totalItems] = await Promise.all([
               this.postModel
                    .find(query)
                    .populate('userId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
               this.postModel.countDocuments(query),
          ]);

          return {
               data,
               pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
               },
          };
     }




}
