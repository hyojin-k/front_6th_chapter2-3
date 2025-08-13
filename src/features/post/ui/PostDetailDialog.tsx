import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";

interface PostDetailDialogProps {
  showPostDetailDialog: boolean;
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => void;
  selectedPost: Partial<PostType> | null;
  searchQuery: string;
  renderComments: (postId: number) => React.ReactNode;
  highlightText: (text: string, query: string) => React.ReactNode;
}

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  renderComments,
  highlightText,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {renderComments(selectedPost?.id || 0)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
