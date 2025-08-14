import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePostStore } from "@/entities/post/model/store";
import { PostType } from "@/entities/post/model/types";
import {
  useGetPostsQuery,
  useGetSearchPostsQuery,
  useGetPostsByTagQuery,
  useGetTagsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/entities/post/api/hooks";
import { URLManager } from "@/shared/lib/urlManager";

export const usePosts = () => {
  const location = useLocation();
  const {
    selectedPost,
    selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
    pagination,
    dialogs,
    newPost,
    setSelectedPost,
    setSelectedTag,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setPagination,
    setDialog,
    setNewPost,
    addPost: addPostToStore,
    updatePost: updatePostInStore,
    deletePost: deletePostFromStore,
    resetNewPost,
  } = usePostStore();

  // URL 파라미터 동기화
  useEffect(() => {
    const params = URLManager.parseURLParams(location.search);
    setPagination(params.skip || 0, params.limit || 10);
    setSearchQuery(params.search || "");
    setSortBy(params.sortBy || "");
    setSortOrder((params.sortOrder as "asc" | "desc") || "asc");
    setSelectedTag(params.tag || "");
  }, [
    location.search,
    setPagination,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
  ]);

  // TanStack Query 훅들
  const { data: tagsData } = useGetTagsQuery();
  const { data: postsData, isLoading: postsLoading } = useGetPostsQuery({
    limit: pagination.limit,
    skip: pagination.skip,
    sortBy,
    sortOrder,
  });

  const { data: searchData, isLoading: searchLoading } = useGetSearchPostsQuery(
    searchQuery,
    sortBy,
    sortOrder,
    { enabled: !!searchQuery },
  );

  const { data: tagData, isLoading: tagLoading } = useGetPostsByTagQuery(
    selectedTag,
    sortBy,
    sortOrder,
    { enabled: !!selectedTag && selectedTag !== "all" },
  );

  // Mutation 훅들
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();

  // 현재 표시할 데이터 결정
  const currentData = searchQuery
    ? searchData
    : selectedTag && selectedTag !== "all"
      ? tagData
      : postsData;

  const currentLoading = searchQuery
    ? searchLoading
    : selectedTag && selectedTag !== "all"
      ? tagLoading
      : postsLoading;

  // 게시물 검색
  const handleSearch = () => {
    // TanStack Query가 자동으로 처리하므로 별도 로직 불필요
  };

  // 게시물 추가
  const handleAddPost = async () => {
    try {
      const postData = {
        title: newPost.title || "",
        body: newPost.body || "",
        userId: newPost.userId || 1,
      };
      const addedPost = await createPostMutation.mutateAsync(postData);
      addPostToStore(addedPost);
      setDialog("showAddDialog", false);
      resetNewPost();
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  // 게시물 수정
  const handleUpdatePost = async () => {
    if (!selectedPost?.id) return;

    console.log("selectedPost", selectedPost);
    try {
      const postData = {
        id: selectedPost.id,
        title: selectedPost.title || "",
        body: selectedPost.body || "",
        userId: selectedPost.userId || 1,
        views: selectedPost.views || 0,
        reactions: selectedPost.reactions || { likes: 0, dislikes: 0 },
        tags: selectedPost.tags || [],
      };
      const updatedPost = await updatePostMutation.mutateAsync(postData);
      updatePostInStore(updatedPost);
      setDialog("showEditDialog", false);
    } catch (error) {
      console.error("게시물 수정 오류:", error);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id);
      deletePostFromStore(id);
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  // 게시물 상세 보기
  const handleOpenPostDetail = (post: PostType) => {
    setSelectedPost(post);
    setDialog("showPostDetailDialog", true);
  };

  return {
    // 상태
    posts: currentData?.posts || [],
    total: currentData?.total || 0,
    loading: currentLoading,
    selectedPost,
    tags: tagsData || [],
    selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
    pagination,
    dialogs,
    newPost,

    // 액션
    setSelectedTag,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setPagination,
    setDialog,
    setNewPost,
    setSelectedPost,
    handleSearch,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handleOpenPostDetail,
    resetNewPost,
  };
};
