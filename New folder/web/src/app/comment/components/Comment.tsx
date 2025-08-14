/* eslint-disable @next/next/no-img-element */

import { CommentType } from "@/app/home/type";

// Đổi tên Comment thành CommentItem
const CommentItem = ({ comment }: { comment: CommentType }) => (
    <div className="flex items-start space-x-2.5">
        <img src={comment.avatarUrl} alt={comment.name} width={32} height={32} className="rounded-full mt-1" />
        <div className="flex flex-col items-start">
            <div className="bg-gray-100 rounded-xl px-3 py-2">
                <p className="font-semibold text-sm text-gray-800">{comment.name}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
            {comment.sticker && <p className="text-4xl mt-1">{comment.sticker}</p>}
        </div>
    </div>
);
export default CommentItem;