import { useQuery } from "@tanstack/react-query";
import { postApi } from "./postApi";
import { GetPostsRequestType } from "../model/types";

export const useGetPosts = (params: GetPostsRequestType) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postApi.getPosts(params),
  });
};

export const useGetSearchPosts = (searchQuery: string) => {
  return useQuery({
    queryKey: ["searchPosts", searchQuery],
    queryFn: () => postApi.getSearchPosts(searchQuery),
  });
};

export const useGetPostsByTag = (tag: string) => {
  return useQuery({
    queryKey: ["postsByTag", tag],
    queryFn: () => postApi.getPostsByTag(tag),
  });
};

export const useGetTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => postApi.getTags(),
  });
};
