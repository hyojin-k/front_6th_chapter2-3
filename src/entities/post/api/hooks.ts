import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "./postApi";
import { postQueryKeys } from "./queryKeys";
import {
  GetPostsRequestType,
  PostPostRequestType,
  PutPostRequestType,
} from "@/entities/post/model/types";

// 게시물 목록 조회
export const useGetPostsQuery = (params: GetPostsRequestType) => {
  return useQuery({
    queryKey: postQueryKeys.list(params),
    queryFn: () => postApi.getPosts(params),
  });
};

// 게시물 검색 조회
export const useGetSearchPostsQuery = (searchQuery: string) => {
  return useQuery({
    queryKey: postQueryKeys.search(searchQuery),
    queryFn: () => postApi.getSearchPosts(searchQuery),
  });
};

// 게시물 태그 조회
export const useGetPostsByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: postQueryKeys.byTag(tag),
    queryFn: () => postApi.getPostsByTag(tag),
  });
};

// 태그 목록 조회
export const useGetTagsQuery = () => {
  return useQuery({
    queryKey: postQueryKeys.tags(),
    queryFn: () => postApi.getTags(),
  });
};

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
