import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { PostCommentRequestType } from "@/features/comment/model/types";

interface CommentAddDialogProps {
  showAddCommentDialog: boolean;
  setShowAddCommentDialog: (showAddCommentDialog: boolean) => void;
  newComment: Partial<PostCommentRequestType>;
  setNewComment: (newComment: Partial<PostCommentRequestType>) => void;
  addComment: () => void;
}

export const CommentAddDialog = ({
  showAddCommentDialog,
  setShowAddCommentDialog,
  newComment,
  setNewComment,
  addComment,
}: CommentAddDialogProps) => {
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
