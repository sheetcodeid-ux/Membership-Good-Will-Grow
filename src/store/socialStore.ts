import { create } from "zustand";

export interface BookmarkCollection {
  id: string;
  name: string;
  postIds: string[];
}

interface SocialState {
  followingIds: string[];
  bookmarkedPostIds: string[];
  collections: BookmarkCollection[];
  toggleFollow: (memberId: string) => void;
  isFollowing: (memberId: string) => boolean;
  toggleBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;
  createCollection: (name: string) => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  followingIds: ["m-einar"],
  bookmarkedPostIds: [],
  collections: [],
  toggleFollow: (memberId) =>
    set((state) => ({
      followingIds: state.followingIds.includes(memberId)
        ? state.followingIds.filter((id) => id !== memberId)
        : [...state.followingIds, memberId],
    })),
  isFollowing: (memberId) => get().followingIds.includes(memberId),
  toggleBookmark: (postId) =>
    set((state) => ({
      bookmarkedPostIds: state.bookmarkedPostIds.includes(postId)
        ? state.bookmarkedPostIds.filter((id) => id !== postId)
        : [...state.bookmarkedPostIds, postId],
    })),
  isBookmarked: (postId) => get().bookmarkedPostIds.includes(postId),
  createCollection: (name) =>
    set((state) => ({
      collections: [...state.collections, { id: `col-${Date.now()}`, name, postIds: [] }],
    })),
}));
