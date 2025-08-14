import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostStore } from "@/entities/post/model/store";
import { PostType } from "@/entities/post/model/types";
import {
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
  const navigate = useNavigate();
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

  // 상태 변경 시 URL 업데이트 (URL 변경으로 인한 것이 아닌 경우에만)
  useEffect(() => {
    const params = URLManager.parseURLParams(location.search);
    const currentSkip = params.skip || 0;
    const currentLimit = params.limit || 10;
    const currentSearch = params.search || "";
    const currentSortBy = params.sortBy || "";
    const currentSortOrder = params.sortOrder || "asc";
    const currentTag = params.tag || "";

    // URL의 값과 현재 상태가 다를 때만 URL 업데이트
    if (
      currentSkip !== pagination.skip ||
      currentLimit !== pagination.limit ||
      currentSearch !== searchQuery ||
      currentSortBy !== sortBy ||
      currentSortOrder !== sortOrder ||
      currentTag !== selectedTag
    ) {
      URLManager.updateURL(navigate, {
        skip: pagination.skip,
        limit: pagination.limit,
        search: searchQuery,
        sortBy,
        sortOrder,
        tag: selectedTag,
      });
    }
  }, [
    pagination.skip,
    pagination.limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    navigate,
    location.search,
  ]);

  // 검색어 변경 시 페이지네이션 리셋
  useEffect(() => {
    if (searchQuery) {
      setPagination(0, pagination.limit);
    }
  }, [searchQuery, setPagination, pagination.limit]);

  // 정렬 기준 변경 시 페이지네이션 리셋
  useEffect(() => {
    setPagination(0, pagination.limit);
  }, [sortBy, sortOrder, setPagination, pagination.limit]);

  // TanStack Query 훅들
  const { data: tagsData } = useGetTagsQuery();
  const { data: searchData, isLoading: searchLoading } = useGetSearchPostsQuery(
    searchQuery,
    sortBy,
    sortOrder,
    { limit: pagination.limit, skip: pagination.skip },
    { enabled: true },
  );

  const { data: tagData, isLoading: tagLoading } = useGetPostsByTagQuery(
    selectedTag || "all",
    sortBy,
    sortOrder,
    { limit: pagination.limit, skip: pagination.skip },
    { enabled: true },
  );

  // Mutation 훅들
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();

  // 현재 표시할 데이터 결정
  const currentData = searchQuery ? searchData : tagData;

  const currentLoading = searchQuery ? searchLoading : tagLoading;

  // 게시물 검색
  const handleSearch = () => {
    // 검색 시 페이지네이션 리셋
    setPagination(0, pagination.limit);
  };

  // 게시물 추가
  const handleAddPost = async () => {
    try {
      const postData = {
        title: newPost.title || "",
        body: newPost.body || "",
        userId: newPost.userId || 1,
      };
      await createPostMutation.mutateAsync(postData);
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
      await updatePostMutation.mutateAsync(postData);
      setDialog("showEditDialog", false);
    } catch (error) {
      console.error("게시물 수정 오류:", error);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async (id: number, onComplete?: () => void) => {
    try {
      await deletePostMutation.mutateAsync(id);
      onComplete?.();
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
      onComplete?.();
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
