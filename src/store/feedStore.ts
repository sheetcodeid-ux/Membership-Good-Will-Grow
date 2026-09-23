import { create } from "zustand";
import { feedPosts as initialPosts, feedComments as initialComments } from "../data/mock";
import type { FeedPost, FeedComment } from "../data/types";

interface FeedState {
  posts: FeedPost[];
  comments: FeedComment[];
  /** True until the first load settles, so the feed can show its skeleton. */
  loading: boolean;
  refreshing: boolean;
  load: () => void;
  refresh: () => Promise<void>;
  toggleLike: (postId: string) => void;
  /**
   * Liking a comment used to be local state in the sheet, so it was lost the
   * moment the sheet closed. It belongs here with everything else the feed
   * remembers.
   */
  toggleCommentLike: (commentId: string) => void;
  /** Hidden posts stay in the store; the feed filters them out. */
  hiddenPostIds: string[];
  hidePost: (postId: string) => void;
  unhidePost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  addComment: (postId: string, text: string) => void;
  commentsFor: (postId: string) => FeedComment[];
  addPost: (caption: string, outletName?: string, brandId?: string) => void;
}

/** Stands in for a network round trip until the API exists. */
const FETCH_MS = 700;

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: initialPosts,
  comments: initialComments,
  hiddenPostIds: [],
  loading: true,
  refreshing: false,
  load: () => {
    if (!get().loading) return;
    setTimeout(() => set({ loading: false }), FETCH_MS);
  },
  refresh: async () => {
    set({ refreshing: true });
    await new Promise((resolve) => setTimeout(resolve, FETCH_MS));
    set({ refreshing: false });
  },
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ),
    })),
  toggleCommentLike: (commentId) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      ),
    })),
  /**
   * Hiding and reporting both take the post out of the feed. Reporting adds
   * nothing else for now — there is no backend to send it to — so it is the
   * same state change behind a different confirmation, rather than a button
   * that appears to work and does nothing.
   */
  hidePost: (postId) =>
    set((state) => ({
      hiddenPostIds: state.hiddenPostIds.includes(postId)
        ? state.hiddenPostIds
        : [...state.hiddenPostIds, postId],
    })),
  unhidePost: (postId) =>
    set((state) => ({ hiddenPostIds: state.hiddenPostIds.filter((id) => id !== postId) })),
  reportPost: (postId) =>
    set((state) => ({
      hiddenPostIds: state.hiddenPostIds.includes(postId)
        ? state.hiddenPostIds
        : [...state.hiddenPostIds, postId],
    })),
  addComment: (postId, text) =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          id: `c-${Date.now()}`,
          postId,
          authorName: "Kamu",
          time: "Baru saja",
          text,
          likes: 0,
        },
      ],
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      ),
    })),
  commentsFor: (postId) => get().comments.filter((c) => c.postId === postId),
  addPost: (caption, outletName, brandId) =>
    set((state) => ({
      posts: [
        {
          id: `post-${Date.now()}`,
          authorName: "Kamu",
          authorHandle: "@kamu",
          time: "Baru saja",
          caption,
          type: outletName ? "checkin" : "post",
          outletName,
          brandId,
          likes: 0,
          comments: 0,
        },
        ...state.posts,
      ],
    })),
}));
