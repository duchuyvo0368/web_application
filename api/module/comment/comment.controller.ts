import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ApiTags } from "@nestjs/swagger";
import { CREATED, SuccessResponse } from "utils/success.response";

@ApiTags("Comment")
@Controller("comment")
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) { }



    @Post("create")
    async createComment(@Body() body: any) {
        const { commentPostId, commentUserId, commentContent, commentParentId } = body;
        if (!commentPostId || !commentUserId || !commentContent) {
            throw new BadRequestException('Missing required fields');
        }
        const result = await this.commentService.createComment({ commentPostId, commentUserId, commentContent, commentParentId });
        return new SuccessResponse({
            metadata: result,
            message: "Create comment successfully",
        })
        
    }
    async getCommentsByParentId(@Body() body: any) {
        const { postId, parentCommentId } = body;
        if (!postId) {
            throw new BadRequestException('Missing required fields');
        }
        const result = await this.commentService.getCommentsByParentId({postId,parentCommentId});
        return new SuccessResponse({
            metadata: result,
            message: "Get comments successfully",
        })
        
    }
    async deleteComments(@Body() body: any) {
        const { postId, commentId } = body;
        if (!postId) {
            throw new BadRequestException('Missing required fields');
        }
        await this.commentService.deleteComments({postId,commentId});
        return new SuccessResponse({
            message: "Delete comment successfully",
        })
        
    }
    

}