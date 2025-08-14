import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui";

import { SearchBar } from "@/widgets/SearchBar";
import { Pagination } from "@/shared/ui/Pagination";
import { PostAddDialog, PostTable } from "@/features/post/ui";
import { usePosts } from "@/features/post/api/usePosts";
import { URLManager } from "@/shared/lib/urlManager";

const PostsManager = () => {
  const navigate = useNavigate();
  const {
    posts,
    total,
    loading,
    tags,
    selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
    pagination,
    dialogs,
    newPost,
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
    handleDeletePost,
  } = usePosts();

  // URL 업데이트 함수
  const updateURL = () => {
    URLManager.updateURL(navigate, {
      skip: pagination.skip,
      limit: pagination.limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setDialog("showAddDialog", true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPosts={handleSearch}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            fetchPostsByTag={() => {}} // 이제 usePosts 훅에서 처리
            updateURL={updateURL}
            tags={tags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={(show) => setDialog("showEditDialog", show)}
              deletePost={handleDeletePost}
              searchQuery={searchQuery}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={pagination.limit}
            setLimit={(limit) => setPagination(pagination.skip, limit)}
            skip={pagination.skip}
            setSkip={(skip) => setPagination(skip, pagination.limit)}
            total={total}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog
        showAddDialog={dialogs.showAddDialog}
        setShowAddDialog={(show) => setDialog("showAddDialog", show)}
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={handleAddPost}
      />
    </Card>
  );
};

export default PostsManager;
