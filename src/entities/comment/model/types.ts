// 댓글 타입
export interface CommentsType {
  comments: CommentType[];
  limit: number;
  skip: number;
  total: number;
}

export interface CommentType {
  id: number;
  body: string;
  likes: number;
  postId: number;
  user: CommentUserType;
}
export interface CommentUserType {
  fullName: string;
  id: number;
  username: string;
}

// 댓글 조회
export type GetCommentsResponseType = CommentsType;

// 댓글 좋아요
export interface PatchCommentLikeRequestType {
  like: number;
}
export type PatchCommentLikeResponseType = CommentType;
