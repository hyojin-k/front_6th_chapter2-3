import {
  PostPostRequestType,
  PostPostResponseType,
  PutPostRequestType,
  PutPostResponseType,
} from "@/features/post/model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi("/api/posts");

export const postApi = {
  // 게시물 추가
  async createPost(
    postData: PostPostRequestType,
  ): Promise<PostPostResponseType> {
    return api.post<PostPostResponseType>("/add", postData);
  },

  // 게시물 수정
  async updatePost(
    id: number,
    postData: PutPostRequestType,
  ): Promise<PutPostResponseType> {
    return api.put<PutPostResponseType>(`/${id}`, postData);
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    return api.delete(`/${id}`);
  },
};
