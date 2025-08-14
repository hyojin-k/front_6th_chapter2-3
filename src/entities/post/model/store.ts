import { create } from "zustand";
import { PostType } from "./types";

interface PostState {
  selectedPost: Partial<PostType> | null;
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
  setSelectedPost: (post: Partial<PostType> | null) => void;
  setSelectedTag: (tag: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setPagination: (skip: number, limit: number) => void;
  setDialog: (dialog: keyof PostState["dialogs"], show: boolean) => void;
  setNewPost: (post: Partial<PostType>) => void;
  resetNewPost: () => void;
}

export const usePostStore = create<PostState & PostActions>((set) => ({
  // 초기 상태
  selectedPost: null,
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
  setSelectedPost: (selectedPost) => set({ selectedPost }),
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
  resetNewPost: () => set({ newPost: { title: "", body: "", userId: 1 } }),
}));
