import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { useCommentStore } from "@/entities/comment/model/store";
import { useEffect, useState } from "react";
import { useUpdateCommentMutation } from "@/features/comment/api";

export const CommentEditDialog = () => {
  const { showEditCommentDialog, selectedComment, setSelectedComment, closeEditCommentDialog } = useCommentStore();
  const [editBody, setEditBody] = useState("");
  const updateCommentMutation = useUpdateCommentMutation();
  useEffect(() => {
    if (selectedComment) {
      setEditBody(selectedComment.body);
    }
  }, [selectedComment]);

  const updateComment = () => {
    if (!selectedComment?.id || !editBody.trim()) return;

    updateCommentMutation.mutate(
      {
        id: selectedComment.id,
        body: editBody,
      },
      {
        onSuccess: () => {
          closeEditCommentDialog();
        },
      },
    );
  };

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={closeEditCommentDialog}>
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
