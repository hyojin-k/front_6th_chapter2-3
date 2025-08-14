import { useQuery } from "@tanstack/react-query";
import { commentApi } from "./commentApi";
import { commentQueryKeys } from "./queryKeys";

// 댓글 목록 조회
export const useGetCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: commentQueryKeys.list(postId),
    queryFn: () => commentApi.getComments(postId),
  });
};
