import {
  GetPostsRequestType,
  GetPostsResponseType,
  TagType,
} from "../model/types";

const API_BASE_URL = "/api/posts";

export const postApi = {
  // 게시물 목록 조회
  getPosts: async (
    params: GetPostsRequestType,
  ): Promise<GetPostsResponseType> => {
    const response = await fetch(
      `${API_BASE_URL}?limit=${params.limit}&skip=${params.skip}`,
    );
    if (!response.ok)
      throw new Error(`게시물 가져오기 오류: ${response.statusText}`);
    return response.json();
  },

  // 게시물 검색 조회
  getSearchPosts: async (
    searchQuery: string,
  ): Promise<GetPostsResponseType> => {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`,
    );
    if (!response.ok)
      throw new Error(`게시물 검색 오류: ${response.statusText}`);
    return response.json();
  },

  // 태그별 게시물 조회
  getPostsByTag: async (tag: string): Promise<GetPostsResponseType> => {
    const response = await fetch(
      `${API_BASE_URL}/tag/${encodeURIComponent(tag)}`,
    );
    if (!response.ok)
      throw new Error(`태그별 게시물 가져오기 오류: ${response.statusText}`);
    return response.json();
  },

  // 태그 목록 조회
  getTags: async (): Promise<TagType[]> => {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok)
      throw new Error(`태그 가져오기 오류: ${response.statusText}`);
    return response.json();
  },
};
