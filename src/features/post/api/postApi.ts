import {
  PostPostRequestType,
  PostPostResponseType,
  PutPostRequestType,
  PutPostResponseType,
} from "@/features/post/model/types";

const API_BASE_URL = "/api/posts";

export const postApi = {
  // 게시물 추가
  createPost: async (postData: PostPostRequestType): Promise<PostPostResponseType> => {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error(`게시물 추가 오류: ${response.statusText}`);
    return response.json();
  },

  // 게시물 수정
  updatePost: async (id: number, postData: PutPostRequestType): Promise<PutPostResponseType> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error(`게시물 수정 오류: ${response.statusText}`);
    return response.json();
  },

  // 게시물 삭제
  deletePost: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`게시물 삭제 오류: ${response.statusText}`);
  },
};
