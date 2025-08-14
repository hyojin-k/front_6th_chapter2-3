import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";
import { UserType } from "@/entities/user/model/types";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Edit2,
  Trash2,
} from "lucide-react";
import { highlightText } from "@/shared/lib";
import { useState } from "react";
import { UserDetailDialog } from "@/entities/user/ui/UserDetailDialog";
import { PostEditDialog } from "./PostEditDialog";
import { PostDetailDialog } from "./PostDetailDialog";

interface PostTableProps {
  posts: PostType[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  updateURL: () => void;
  setSelectedPost: (post: PostType) => void;
  setShowEditDialog: (show: boolean) => void;
  deletePost: (id: number) => void;
  searchQuery: string;
}

export const PostTable = ({
  posts,
  selectedTag,
  setSelectedTag,
  updateURL,
  deletePost,
  searchQuery,
}: PostTableProps) => {
  // 사용자 상세 보기
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(
    undefined,
  );
  const [showUserModal, setShowUserModal] = useState(false);

  // 게시물 상세 보기
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);

  // 게시물 수정
  const [selectedPost, setSelectedPost] = useState<Partial<PostType> | null>(
    null,
  );
  const [showPostEditDialog, setShowPostEditDialog] = useState(false);

  const handleEditPost = (post: Partial<PostType>) => {
    setSelectedPost(post);
    setShowPostEditDialog(true);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag);
                        updateURL();
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => {
                  if (post.author) {
                    setShowUserModal(true);
                    setSelectedUser(post.author);
                  }
                }}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setShowPostDetailDialog(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPost(post)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {/* 사용자 상세 보기 */}
      {selectedUser && (
        <UserDetailDialog
          open={showUserModal}
          onClose={() => setShowUserModal(false)}
          selectedUser={selectedUser}
        />
      )}

      {/* 게시물 상세 보기 */}
      {showPostDetailDialog && (
        <PostDetailDialog
          open={showPostDetailDialog}
          onClose={() => setShowPostDetailDialog(false)}
          selectedPost={selectedPost}
          searchQuery={searchQuery}
        />
      )}

      {/* 게시물 수정 */}
      {showPostEditDialog && (
        <PostEditDialog
          open={showPostEditDialog}
          onClose={() => setShowPostEditDialog(false)}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      )}
    </Table>
  );
};
