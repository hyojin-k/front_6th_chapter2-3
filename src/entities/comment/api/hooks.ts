import { useQuery } from "@tanstack/react-query";
import { commentApi } from "./commentApi";

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentApi.getComments(postId),
  });
};
