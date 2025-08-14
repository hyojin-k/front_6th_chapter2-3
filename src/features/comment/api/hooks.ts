import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "./commentApi";
import { commentQueryKeys } from "@/entities/comment/api/queryKeys";
import { PostCommentRequestType } from "../model/types";
import {
  CommentType,
  GetCommentsResponseType,
} from "@/entities/comment/model/types";

// 댓글 추가
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostCommentRequestType) => {
      return commentApi.createComment(req);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(
        commentQueryKeys.list(res.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;

          const newData = {
            ...old,
            comments: [res, ...old.comments],
            total: old.total + 1,
          };
          return newData;
        },
      );
    },
    onError: (error, variables) => {
      console.error("댓글 추가 실패:", error);
      if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.list(variables.postId),
        });
      }
    },
  });
};

// 댓글 수정
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => {
      return commentApi.updateComment(id, { body });
    },
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(
        commentQueryKeys.list(updatedComment.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;
          const newData = {
            ...old,
            comments: old.comments.map((comment: CommentType) =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          };
          return newData;
        },
      );
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error);
    },
  });
};

// 댓글 삭제
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => {
      return commentApi.deleteComment(id);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        commentQueryKeys.list(variables.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;
          const newData = {
            ...old,
            comments: old.comments.filter(
              (comment: CommentType) => comment.id !== variables.id,
            ),
            total: old.total - 1,
          };
          return newData;
        },
      );
    },
    onError: (error, variables) => {
      console.error("댓글 삭제 실패:", error);
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.list(variables.postId),
      });
    },
  });
};

// 댓글 좋아요
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      currentLikes,
      postId,
    }: {
      id: number;
      currentLikes: number;
      postId: number;
    }) => {
      const newLikes = currentLikes + 1;

      try {
        await commentApi.likeComment(id, currentLikes);
      } catch (error) {
        console.warn("서버 좋아요 요청 실패, 클라이언트에서만 처리:", error);
      }

      return { id, postId, likes: newLikes };
    },
    onSuccess: ({ id, postId, likes }) => {
      queryClient.setQueryData(
        commentQueryKeys.list(postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;
          const newData = {
            ...old,
            comments: old.comments.map((comment: CommentType) =>
              comment.id === id ? { ...comment, likes } : comment,
            ),
          };
          return newData;
        },
      );
    },
  });
};
