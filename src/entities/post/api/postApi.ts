import {
  GetPostsRequestType,
  GetPostsResponseType,
  TagType,
} from "../model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi("/api/posts");

export const postApi = {
  // 게시물 목록 조회
  async getPosts(params: GetPostsRequestType): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(
      `?limit=${params.limit}&skip=${params.skip}`,
    );
  },

  // 게시물 검색 조회
  async getSearchPosts(searchQuery: string): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(
      `/search?q=${encodeURIComponent(searchQuery)}`,
    );
  },

  // 태그별 게시물 조회
  async getPostsByTag(tag: string): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(`/tag/${encodeURIComponent(tag)}`);
  },

  // 태그 목록 조회
  async getTags(): Promise<TagType[]> {
    return api.get<TagType[]>("/tags");
  },
};
