import { CommentType } from "@/entities/comment/model/types";
import { PostCommentRequestType, PostCommentResponseType } from "../model/types";
import { PutCommentRequestType } from "../model/types";

const API_BASE_URL = "/api/comments";

export const commentApi = {
  // 댓글 추가
  createComment: async (commentData: PostCommentRequestType): Promise<PostCommentResponseType> => {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error(`댓글 추가 오류: ${response.statusText}`);
    return response.json();
  },

  // 댓글 수정
  updateComment: async (id: number, commentData: Pick<PutCommentRequestType, "body">): Promise<CommentType> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error(`댓글 수정 오류: ${response.statusText}`);
    return response.json();
  },

  // 댓글 삭제
  deleteComment: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`댓글 삭제 오류: ${response.statusText}`);
  },

  // 댓글 좋아요
  likeComment: async (id: number, currentLikes: number): Promise<CommentType> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: currentLikes + 1 }), // 현재 좋아요 수 + 1
    });
    if (!response.ok) throw new Error(`댓글 좋아요 오류: ${response.statusText}`);
    return response.json();
  },
};
