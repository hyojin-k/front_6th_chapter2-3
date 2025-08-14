import { GetCommentsResponseType } from "../model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi("/api/comments");

export const commentApi = {
  // 댓글 목록 조회
  async getComments(postId: number): Promise<GetCommentsResponseType> {
    return api.get<GetCommentsResponseType>(`/post/${postId}`);
  },
};
