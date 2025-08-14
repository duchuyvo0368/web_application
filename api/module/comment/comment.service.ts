import { convertToObject } from './../../utils/index';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.model';
import { logger } from 'utils/logger';

@Injectable()
export class CommentService {
    constructor(private readonly commentRepository: CommentRepository) { }

    async createComment({
        commentPostId,
        commentUserId,
        commentContent,
        commentParentId,
    }: {
        commentPostId: string;
        commentUserId: string;
        commentContent: string;
        commentParentId: string;
    }): Promise<Comment> {
        let rightValue: number;

        if (commentParentId) {
            const parentComment = await this.commentRepository.findById(commentParentId);
            if (!parentComment) throw new NotFoundException('Parent comment not found');
            rightValue = parentComment.comment_right;

            await this.commentRepository.updateRightValues(commentPostId, rightValue);
            await this.commentRepository.updateLeftValues(commentPostId, rightValue);
        } else {
            const maxRight = await this.commentRepository.findMaxRightValue(commentPostId);
            rightValue = maxRight ? maxRight + 1 : 1;
        }

        logger.info(`rightValue: ${typeof convertToObject(commentUserId)}`)
        const comment = await this.commentRepository.create(
            commentPostId,
            commentUserId,
            commentContent,
            commentParentId,
            rightValue,
            rightValue + 1,
        );
        return comment;
    }

    async getCommentsByParentId({
        postId,
        parentCommentId = null,
        limit = 50,
        offset = 0,
    }: {
        postId: string;
        parentCommentId?: string | null;
        limit?: number;
        offset?: number;
    }) {
        let comments;

        if (parentCommentId) {
            const parentComment = await this.commentRepository.findById(parentCommentId);
            if (!parentComment) throw new NotFoundException('Parent comment not found');

            comments = await this.commentRepository.findCommentsByParentRange(
                postId,
                parentComment.comment_left,
                parentComment.comment_right,
            );
        } else {
            comments = await this.commentRepository.findRootComments(postId);
        }

        // simple pagination in-memory (can optimize with skip/limit in query)
        return comments.slice(offset, offset + limit);
    }

    async deleteComments({
        commentId,
        postId,
    }: {
        commentId: string;
        postId: string;
    }): Promise<boolean> {
        const comment = await this.commentRepository.findById(commentId);
        if (!comment) throw new NotFoundException('Comment not found');

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;
        const width = rightValue - leftValue + 1;

        await this.commentRepository.deleteCommentsByRange(postId, leftValue, rightValue);
        await this.commentRepository.decrementRightValues(postId, rightValue, width);
        await this.commentRepository.decrementLeftValues(postId, rightValue, width);

        return true;
    }


    async getCommentsByPostId({
        postId,
    }: {
        postId: string;
    }) {
        const comments = await this.commentRepository.findCommentsByPostId(postId);
        return comments;
    }
}
