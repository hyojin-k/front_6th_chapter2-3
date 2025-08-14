import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";
import { Comments } from "@/features/comment/ui";
import { highlightText } from "@/shared/lib";

interface PostDetailDialogProps {
  showPostDetailDialog: boolean;
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => void;
  selectedPost: Partial<PostType> | null;
  searchQuery: string;
}

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost?.id && <Comments postId={selectedPost.id} searchQuery={searchQuery} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
