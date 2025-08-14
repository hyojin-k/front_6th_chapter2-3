import { Button } from "@/shared/ui";
import { CommentType } from "@/entities/comment/model/types";
import { Plus, ThumbsUp, Trash2, Edit2 } from "lucide-react";
import { PostCommentRequestType } from "@/features/comment/model/types";
import { Comment } from "@/entities/comment/ui";

interface CommentsProps {
  comments: CommentType[];
  postId: number;
  setNewComment: (comment: Partial<PostCommentRequestType>) => void;
  setShowAddCommentDialog: (show: boolean) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
  searchQuery: string;
  likeComment: (id: number, postId: number) => void;
  deleteComment: (id: number, postId: number) => void;
  setSelectedComment: (comment: CommentType) => void;
  setShowEditCommentDialog: (show: boolean) => void;
}

export const Comments = ({
  comments,
  postId,
  setNewComment,
  setShowAddCommentDialog,
  highlightText,
  searchQuery,
  likeComment,
  deleteComment,
  setSelectedComment,
  setShowEditCommentDialog,
}: CommentsProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment({ body: "", postId, userId: 1 });
            // setNewComment((prev) => ({ ...prev, postId }));
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment: CommentType) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <Comment comment={comment} highlightText={highlightText} searchQuery={searchQuery} />
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment);
                  setShowEditCommentDialog(true);
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
