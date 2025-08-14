import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "./postApi";
import { userApi } from "@/entities/user/api/userApi";
import { postQueryKeys } from "./queryKeys";
import {
  GetPostsRequestType,
  PostPostRequestType,
  PutPostRequestType,
  PostType,
} from "@/entities/post/model/types";
import { UserType } from "@/entities/user/model/types";

// 게시물과 사용자 정보 결합
const combinePostsWithUsers = (
  posts: PostType[],
  users: UserType[],
): PostType[] => {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }));
};

// 게시물 정렬
const sortPosts = (
  posts: PostType[],
  sortBy: string,
  sortOrder: "asc" | "desc",
): PostType[] => {
  if (!sortBy || sortBy === "none") return posts;

  return [...posts].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "reactions":
        aValue = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0);
        bValue = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0);
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

// 게시물 목록 조회 (사용자 정보 포함)
export const useGetPostsQuery = (
  params: GetPostsRequestType & { sortBy?: string; sortOrder?: "asc" | "desc" },
) => {
  const { sortBy = "", sortOrder = "asc", ...postParams } = params;

  return useQuery({
    queryKey: postQueryKeys.list(postParams),
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.getPosts(postParams.limit, postParams.skip),
        userApi.getUsers(),
      ]);

      const postsWithUsers = combinePostsWithUsers(
        postsData.posts,
        usersData.users,
      );
      const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

      return {
        posts: sortedPosts,
        total: postsData.total,
      };
    },
  });
};

// 게시물 검색 조회 (사용자 정보 포함)
export const useGetSearchPostsQuery = (
  searchQuery: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: postQueryKeys.search(searchQuery),
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.searchPosts(searchQuery),
        userApi.getUsers(),
      ]);

      const postsWithUsers = combinePostsWithUsers(
        postsData.posts,
        usersData.users,
      );
      const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

      return {
        posts: sortedPosts,
        total: postsData.total,
      };
    },
    enabled: options?.enabled ?? !!searchQuery,
  });
};

// 게시물 태그 조회 (사용자 정보 포함)
export const useGetPostsByTagQuery = (
  tag: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: postQueryKeys.byTag(tag),
    queryFn: async () => {
      if (!tag || tag === "all") {
        const [postsData, usersData] = await Promise.all([
          postApi.getPosts(10, 0),
          userApi.getUsers(),
        ]);

        const postsWithUsers = combinePostsWithUsers(
          postsData.posts,
          usersData.users,
        );
        const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

        return {
          posts: sortedPosts,
          total: postsData.total,
        };
      }

      const [postsData, usersData] = await Promise.all([
        postApi.getPostsByTag(tag),
        userApi.getUsers(),
      ]);

      const postsWithUsers = combinePostsWithUsers(
        postsData.posts,
        usersData.users,
      );
      const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

      return {
        posts: sortedPosts,
        total: postsData.total,
      };
    },
    enabled: options?.enabled ?? true,
  });
};

// 태그 목록 조회
export const useGetTagsQuery = () => {
  return useQuery({
    queryKey: postQueryKeys.tags(),
    queryFn: () => postApi.getTags(),
  });
};

// 게시물 추가
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostPostRequestType) => postApi.addPost(req),
    onSuccess: () => {
      console.log("게시물 추가 성공 - 캐시 무효화 시작");
      // 모든 쿼리 무효화
      queryClient.invalidateQueries();
    },
  });
};

// 게시물 수정
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PutPostRequestType) => postApi.updatePost(req.id, req),
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: postQueryKeys.all,
      });

      // 낙관적 업데이트 - 즉시 UI에 반영
      queryClient.setQueriesData(
        { queryKey: postQueryKeys.all },
        (oldData: { posts: PostType[]; total: number } | undefined) => {
          if (!oldData || !Array.isArray(oldData.posts)) {
            return oldData;
          }

          return {
            ...oldData,
            posts: oldData.posts.map((post: PostType) =>
              post.id === updatedPost.id ? updatedPost : post,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      console.error("게시물 수정 실패:", err);
    },
    onSuccess: (updatedPost) => {
      console.log("게시물 수정 성공:", updatedPost);
    },
  });
};

// 게시물 삭제
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: () => {
      console.log("게시물 삭제 성공 - 캐시 무효화 시작");
      // 모든 쿼리 무효화
      queryClient.invalidateQueries();
    },
  });
};
