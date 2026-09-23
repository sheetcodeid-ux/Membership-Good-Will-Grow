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
  /**
   * Collections could be created but never filled, so every one of them
   * stayed empty for good — a folder you cannot put anything in.
   */
  toggleInCollection: (collectionId: string, postId: string) => void;
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
  toggleInCollection: (collectionId, postId) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id !== collectionId
          ? c
          : {
              ...c,
              postIds: c.postIds.includes(postId)
                ? c.postIds.filter((id) => id !== postId)
                : [...c.postIds, postId],
            }
      ),
    })),
  createCollection: (name) =>
    set((state) => ({
      collections: [...state.collections, { id: `col-${Date.now()}`, name, postIds: [] }],
    })),
}));
