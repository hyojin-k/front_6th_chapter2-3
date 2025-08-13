import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui";
import { PostCommentRequestType } from "@/features/comment/model/types";
import { CommentType } from "@/entities/comment/model/types";
import { GetPostsResponseType, PostType, TagType } from "@/entities/post/model/types";
import { GetUsersResponseType, UserDetailType, UserType } from "@/entities/user/model/types";
import { SearchBar } from "@/widgets/SearchBar";
import { Pagination } from "@/shared/ui/Pagination";
import { PostAddDialog, PostEditDialog, PostDetailDialog } from "@/features/post/ui";
import { CommentAddDialog, CommentEditDialog } from "@/features/comment/ui";
import { UserDetailDialog } from "@/entities/user/ui";
import { PostTable } from "@/entities/post/ui";

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  const [posts, setPosts] = useState<PostType[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [selectedPost, setSelectedPost] = useState<Partial<PostType> | null>(null);
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newPost, setNewPost] = useState<Partial<PostType>>({ title: "", body: "", userId: 1 });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  const [comments, setComments] = useState<Record<number, CommentType[]>>({});
  const [selectedComment, setSelectedComment] = useState<Partial<PostCommentRequestType> | null>(null);
  const [newComment, setNewComment] = useState<Partial<PostCommentRequestType>>({ body: "", postId: null, userId: 1 });
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<UserDetailType> | null>(null);

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", skip.toString());
    if (limit) params.set("limit", limit.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (selectedTag) params.set("tag", selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true);
    let postsData: GetPostsResponseType;
    let usersData: GetUsersResponseType;

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data;
        return fetch("/api/users?limit=0&select=username,image");
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users;
        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.find((user: UserType) => user.id === post.userId),
        }));

        setPosts(postsWithUsers);
        setTotal(postsData.total);
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("태그 가져오기 오류:", error);
    }
  };

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    }
    setLoading(false);
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ]);
      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      const postsWithUsers = postsData.posts.map((post: PostType) => ({
        ...post,
        author: usersData.users.find((user: UserType) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    }
    setLoading(false);
  };

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const data = await response.json();
      setPosts([data, ...posts]);
      setShowAddDialog(false);
      setNewPost({ title: "", body: "", userId: 1 });
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPost?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      });
      const data = await response.json();
      setPosts(posts.map((post) => (post.id === data.id ? data : post)));
      setShowEditDialog(false);
    } catch (error) {
      console.error("게시물 업데이트 오류:", error);
    }
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = await response.json();
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      setShowAddCommentDialog(false);
      setNewComment({ body: "", postId: null, userId: 1 });
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment?.body }),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }));
      setShowEditCommentDialog(false);
    } catch (error) {
      console.error("댓글 업데이트 오류:", error);
    }
  };

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const comment = comments[postId]?.find((c: CommentType) => c.id === id);
      if (!comment) return;

      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comment?.likes + 1 }),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }));
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: PostType) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: UserType) => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get("skip") || "0"));
    setLimit(parseInt(params.get("limit") || "10"));
    setSearchQuery(params.get("search") || "");
    setSortBy(params.get("sortBy") || "");
    setSortOrder(params.get("sortOrder") || "asc");
    setSelectedTag(params.get("tag") || "");
  }, [location.search]);

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null;
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    );
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
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
            searchPosts={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            fetchPostsByTag={fetchPostsByTag}
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
              highlightText={highlightText}
              openUserModal={openUserModal}
              openPostDetail={openPostDetail}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              deletePost={deletePost}
              searchQuery={searchQuery}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        updatePost={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        updateComment={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
        highlightText={highlightText}
        comments={comments[selectedPost?.id || 0] || []}
        setNewComment={setNewComment}
        setShowAddCommentDialog={setShowAddCommentDialog}
        likeComment={likeComment}
        deleteComment={deleteComment}
        setSelectedComment={setSelectedComment}
        setShowEditCommentDialog={setShowEditCommentDialog}
      />

      {/* 사용자 모달 */}
      <UserDetailDialog showUserModal={showUserModal} setShowUserModal={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  );
};

export default PostsManager;
