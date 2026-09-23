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
  addComment: (postId: string, text: string) => void;
  commentsFor: (postId: string) => FeedComment[];
  addPost: (caption: string, outletName?: string, brandId?: string) => void;
}

/** Stands in for a network round trip until the API exists. */
const FETCH_MS = 700;

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: initialPosts,
  comments: initialComments,
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
