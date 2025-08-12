import { PostType } from "@/entities/post/model/types";

// 게시물 추가
export interface PostPostRequestType {
  title: string;
  body: string;
  userId: number;
}
export interface PostPostResponseType {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// 게시물 수정
export type PutPostRequestType = PostType;
export type PutPostResponseType = Omit<PostType, "author" | "views">;
