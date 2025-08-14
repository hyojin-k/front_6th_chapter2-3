import { create } from "zustand";
import { PostType, TagType } from "./types";

interface PostState {
  posts: PostType[];
  total: number;
  loading: boolean;
  selectedPost: Partial<PostType> | null;
  tags: TagType[];
  selectedTag: string;
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  pagination: {
    skip: number;
    limit: number;
  };
  dialogs: {
    showAddDialog: boolean;
    showEditDialog: boolean;
    showPostDetailDialog: boolean;
  };
  newPost: Partial<PostType>;
}

interface PostActions {
  setPosts: (posts: PostType[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setSelectedPost: (post: Partial<PostType> | null) => void;
  setTags: (tags: TagType[]) => void;
  setSelectedTag: (tag: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setPagination: (skip: number, limit: number) => void;
  setDialog: (dialog: keyof PostState["dialogs"], show: boolean) => void;
  setNewPost: (post: Partial<PostType>) => void;
  addPost: (post: PostType) => void;
  updatePost: (post: PostType) => void;
  deletePost: (id: number) => void;
  resetNewPost: () => void;
}

export const usePostStore = create<PostState & PostActions>((set, get) => ({
  // 초기 상태
  posts: [],
  total: 0,
  loading: false,
  selectedPost: null,
  tags: [],
  selectedTag: "",
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  pagination: {
    skip: 0,
    limit: 10,
  },
  dialogs: {
    showAddDialog: false,
    showEditDialog: false,
    showPostDetailDialog: false,
  },
  newPost: {
    title: "",
    body: "",
    userId: 1,
  },

  // 액션들
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setTags: (tags) => set({ tags }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setPagination: (skip, limit) => set({ pagination: { skip, limit } }),
  setDialog: (dialog, show) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [dialog]: show },
    })),
  setNewPost: (newPost) => set({ newPost }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === post.id ? post : p)),
    })),
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    })),
  resetNewPost: () => set({ newPost: { title: "", body: "", userId: 1 } }),
}));
