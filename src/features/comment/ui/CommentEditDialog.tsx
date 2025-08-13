import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { PostCommentRequestType } from "@/features/comment/model/types";

interface CommentEditDialogProps {
  showEditCommentDialog: boolean;
  setShowEditCommentDialog: (showEditCommentDialog: boolean) => void;
  selectedComment: Partial<PostCommentRequestType> | null;
  setSelectedComment: (selectedComment: Partial<PostCommentRequestType> | null) => void;
  updateComment: () => void;
}

export const CommentEditDialog = ({
  showEditCommentDialog,
  setShowEditCommentDialog,
  selectedComment,
  setSelectedComment,
  updateComment,
}: CommentEditDialogProps) => {
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => setSelectedComment(selectedComment ? { ...selectedComment, body: e.target.value } : null)}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
