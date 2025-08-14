export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (params: { limit: number; skip: number }) => [...postQueryKeys.lists(), params] as const,
  search: (query: string) => [...postQueryKeys.all, "search", query] as const,
  byTag: (tag: string) => [...postQueryKeys.all, "tag", tag] as const,
  tags: () => [...postQueryKeys.all, "tags"] as const,
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
} as const;
