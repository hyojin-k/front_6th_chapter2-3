import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";
import { Comment } from "@/entities/comment/ui";
import { CommentType } from "@/entities/comment/model/types";
import { PostCommentRequestType } from "@/features/comment/model/types";

interface PostDetailDialogProps {
  showPostDetailDialog: boolean;
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => void;
  selectedPost: Partial<PostType> | null;
  searchQuery: string;
  highlightText: (text: string, query: string) => React.ReactNode;
  comments: CommentType[];
  setNewComment: (comment: Partial<PostCommentRequestType>) => void;
  setShowAddCommentDialog: (show: boolean) => void;
  likeComment: (id: number, postId: number) => void;
  deleteComment: (id: number, postId: number) => void;
  setSelectedComment: (comment: CommentType) => void;
  setShowEditCommentDialog: (show: boolean) => void;
}

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  highlightText,
  comments,
  setNewComment,
  setShowAddCommentDialog,
  likeComment,
  deleteComment,
  setSelectedComment,
  setShowEditCommentDialog,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          <Comment
            comments={comments}
            postId={selectedPost?.id || 0}
            setNewComment={setNewComment}
            setShowAddCommentDialog={setShowAddCommentDialog}
            highlightText={highlightText}
            searchQuery={searchQuery}
            likeComment={likeComment}
            deleteComment={deleteComment}
            setSelectedComment={setSelectedComment}
            setShowEditCommentDialog={setShowEditCommentDialog}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
