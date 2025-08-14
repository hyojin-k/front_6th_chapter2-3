import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";
import { useUpdatePostMutation } from "@/entities/post/api/hooks";

interface PostEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedPost: Partial<PostType> | null;
  setSelectedPost: (selectedPost: Partial<PostType> | null) => void;
}

export const PostEditDialog = ({
  open,
  onClose,
  selectedPost,
  setSelectedPost,
}: PostEditDialogProps) => {
  const updatePostMutation = useUpdatePostMutation();

  const updatePost = () => {
    if (!selectedPost?.id) return;

    updatePostMutation.mutate(selectedPost as PostType, {
      onSuccess: () => {
        onClose();
        setSelectedPost(null);
      },
      onError: (error) => {
        console.error("게시물 수정 실패:", error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
