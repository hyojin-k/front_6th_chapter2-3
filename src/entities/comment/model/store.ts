import { create } from "zustand";
import { CommentType } from "@/entities/comment/model/types";
import { PostCommentRequestType } from "@/features/comment/model/types";

interface CommentDialogState {
  // 댓글 추가 다이얼로그
  showAddCommentDialog: boolean;
  newComment: Partial<PostCommentRequestType>;

  // 댓글 수정 다이얼로그
  showEditCommentDialog: boolean;
  selectedComment: CommentType | null;
}

interface CommentDialogActions {
  // 댓글 추가 다이얼로그 관련
  setShowAddCommentDialog: (show: boolean) => void;
  setNewComment: (comment: Partial<PostCommentRequestType>) => void;
  resetNewComment: () => void;

  // 댓글 수정 다이얼로그 관련
  setShowEditCommentDialog: (show: boolean) => void;
  setSelectedComment: (comment: CommentType | null) => void;
  openEditCommentDialog: (comment: CommentType) => void;
  closeEditCommentDialog: () => void;
}

export type CommentStore = CommentDialogState & CommentDialogActions;

const initialNewComment: Partial<PostCommentRequestType> = {
  body: "",
  postId: null,
  userId: 1,
};

export const useCommentStore = create<CommentStore>((set) => ({
  // 상태
  showAddCommentDialog: false,
  newComment: { ...initialNewComment },
  showEditCommentDialog: false,
  selectedComment: null,

  // 액션들
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setNewComment: (comment) => set({ newComment: comment }),
  resetNewComment: () => set({ newComment: { ...initialNewComment } }),

  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  openEditCommentDialog: (comment) =>
    set({
      showEditCommentDialog: true,
      selectedComment: comment,
    }),
  closeEditCommentDialog: () =>
    set({
      showEditCommentDialog: false,
      selectedComment: null,
    }),
}));
