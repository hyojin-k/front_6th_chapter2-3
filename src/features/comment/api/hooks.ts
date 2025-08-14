import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "./commentApi";
import { PostCommentRequestType, PutCommentRequestType } from "../model/types";
import { commentQueryKeys } from "../../../entities/comment/api";

// 댓글 추가
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostCommentRequestType) => commentApi.createComment(req),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(res.postId) });
    },
  });
};

// 댓글 수정
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PutCommentRequestType) => commentApi.updateComment(req.id, req),
    onSuccess: (res) => {
      queryClient.setQueryData(commentQueryKeys.detail(res.id), res);
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(res.postId) });
    },
  });
};

// 댓글 삭제
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commentApi.deleteComment(id),
    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: commentQueryKeys.detail(res.id) });
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(res.postId) });
    },
  });
};

// 댓글 좋아요
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commentApi.likeComment(id),
    onSuccess: (res) => {
      queryClient.setQueryData(commentQueryKeys.detail(res.id), res);
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(res.postId) });
    },
  });
};
