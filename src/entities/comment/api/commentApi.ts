import { GetCommentsResponseType } from "../model/types";

const API_BASE_URL = "/api/comments";

export const commentApi = {
  // 댓글 목록 조회
  getComments: async (postId: number): Promise<GetCommentsResponseType> => {
    const response = await fetch(`${API_BASE_URL}/post/${postId}`);
    if (!response.ok)
      throw new Error(`댓글 가져오기 오류: ${response.statusText}`);
    return response.json();
  },
};
