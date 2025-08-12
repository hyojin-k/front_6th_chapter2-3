import { useQuery } from "@tanstack/react-query";
import { postApi } from "./postApi";
import { GetPostsRequestType } from "../model/types";

// 게시물 목록 조회
export const useGetPostsQuery = (params: GetPostsRequestType) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postApi.getPosts(params),
  });
};

// 게시물 검색 조회
export const useGetSearchPostsQuery = (searchQuery: string) => {
  return useQuery({
    queryKey: ["searchPosts", searchQuery],
    queryFn: () => postApi.getSearchPosts(searchQuery),
  });
};

// 게시물 태그 조회
export const useGetPostsByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: ["postsByTag", tag],
    queryFn: () => postApi.getPostsByTag(tag),
  });
};

// 태그 목록 조회
export const useGetTagsQuery = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => postApi.getTags(),
  });
};
