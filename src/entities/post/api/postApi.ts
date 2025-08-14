import {
  GetPostsResponseType,
  GetPostsRequestType,
  PostPostRequestType,
  PostPostResponseType,
  PutPostRequestType,
  PutPostResponseType,
  TagType,
} from "@/entities/post/model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi();

export const postApi = {
  // 게시물 목록 조회
  async getPosts(params: GetPostsRequestType): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(
      `/posts?limit=${params.limit}&skip=${params.skip}`,
    );
  },

  // 게시물 검색 조회
  async getSearchPosts(searchQuery: string): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(
      `/posts/search?q=${encodeURIComponent(searchQuery)}`,
    );
  },

  // 태그별 게시물 조회
  async getPostsByTag(tag: string): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(
      `/posts/tag/${encodeURIComponent(tag)}`,
    );
  },

  // 태그 목록 조회
  async getTags(): Promise<TagType[]> {
    return api.get<TagType[]>("/posts/tags");
  },

  // 게시물 추가
  async createPost(
    postData: PostPostRequestType,
  ): Promise<PostPostResponseType> {
    return api.post<PostPostResponseType>("/posts/add", postData);
  },

  // 게시물 수정
  async updatePost(
    id: number,
    postData: PutPostRequestType,
  ): Promise<PutPostResponseType> {
    return api.put<PutPostResponseType>(`/posts/${id}`, postData);
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    return api.delete(`/posts/${id}`);
  },
};
