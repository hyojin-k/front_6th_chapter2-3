import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostPostRequestType, PutPostRequestType } from "../model/types";
import { postApi } from "./postApi";
import { postQueryKeys } from "../../../entities/post/api";

// 게시물 추가
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostPostRequestType) => postApi.createPost(req),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      queryClient.setQueryData(postQueryKeys.detail(res.id), res);
    },
  });
};

// 게시물 수정
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PutPostRequestType) => postApi.updatePost(req.id, req),
    onSuccess: (res) => {
      queryClient.setQueryData(postQueryKeys.detail(res.id), res);
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
    },
  });
};

// 게시물 삭제
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: postQueryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
  });
};
