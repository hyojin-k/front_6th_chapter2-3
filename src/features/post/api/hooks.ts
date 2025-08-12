import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostPostRequestType, PutPostRequestType } from "../model/types";
import { postApi } from "./postApi";

// 게시물 추가
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostPostRequestType) => postApi.createPost(req),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts", res.id] });
    },
  });
};

// 게시물 수정
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PutPostRequestType) => postApi.updatePost(req.id, req),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts", res.id] });
    },
  });
};

// 게시물 삭제
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts", res] });
    },
  });
};
