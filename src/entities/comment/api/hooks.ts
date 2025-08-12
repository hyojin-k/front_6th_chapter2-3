import { useQuery } from "@tanstack/react-query";
import { commentApi } from "./commentApi";

// 댓글 목록 조회
export const useGetCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentApi.getComments(postId),
  });
};
