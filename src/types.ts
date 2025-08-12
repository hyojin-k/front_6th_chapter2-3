// 게시물 타입
export interface PostsType {
  posts: PostType[];
  limit: number;
  skip: number;
  total: number;
}

export interface PostType {
  id: number;
  title: string;
  body: string;
  userId: number;
  views: number;
  reactions: {
    dislikes: number;
    likes: number;
  };
  author: UserType;
  tags: string[];
}

// 태그 타입
export interface TagType {
  name: string;
  slug: string;
  url: string;
}

// 사용자 타입
export interface UsersType {
  users: UserType[];
  limit: number;
  skip: number;
  total: number;
}

export interface UserType {
  id: number;
  image: string;
  username: string;
}

export interface UserDetailType {
  address: AddressType;
  age: number;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  birthDate: string;
  bloodGroup: string;
  company: {
    address: AddressType;
    department: string;
    name: string;
    title: string;
  };
  crypto: {
    coin: string;
    network: string;
    wallet: string;
  };
  ein: string;
  email: string;
  eyeColor: string;
  firstName: string;
  gender: string;
  hair: {
    color: string;
    type: string;
  };
  height: number;
  id: number;
  image: string;
  ip: string;
  lastName: string;
  macAddress: string;
  maidenName: string;
  password: string;
  phone: string;
  role: string;
  ssn: string;
  university: string;
  userAgent: string;
  username: string;
  weight: number;
}

export interface AddressType {
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  postalCode: string;
  state: string;
  stateCode: string;
}

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

//--------------------------------

// 게시물
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

export type PutPostRequestType = PostType;
export type PutPostResponseType = Omit<PostType, "author" | "views">;

// 댓글
export interface PostCommentRequestType {
  body: string;
  postId: number | null;
  userId: number;
}
export interface PostCommentResponseType {
  id: number;
  body: string;
  postId: number;
  user: CommentUserType;
}

export interface PutCommentRequestType {
  body: string;
}
export type PutCommentResponseType = CommentType;

// 댓글 좋아요
export interface PatchCommentLikeRequestType {
  like: number;
}
export type PatchCommentLikeResponseType = CommentType;
