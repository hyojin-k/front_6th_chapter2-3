import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";

interface PostEditDialogProps {
  showEditDialog: boolean;
  setShowEditDialog: (showEditDialog: boolean) => void;
  selectedPost: Partial<PostType> | null;
  setSelectedPost: (selectedPost: Partial<PostType> | null) => void;
  updatePost: () => void;
}

export const PostEditDialog = ({
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  updatePost,
}: PostEditDialogProps) => {
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) =>
              setSelectedPost(
                selectedPost
                  ? { ...selectedPost, title: e.target.value }
                  : null,
              )
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) =>
              setSelectedPost(
                selectedPost ? { ...selectedPost, body: e.target.value } : null,
              )
            }
          />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
