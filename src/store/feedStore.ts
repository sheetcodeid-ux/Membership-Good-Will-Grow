import { create } from "zustand";
import { feedPosts as initialPosts, feedComments as initialComments } from "../data/mock";
import type { FeedPost, FeedComment } from "../data/types";

interface FeedState {
  posts: FeedPost[];
  comments: FeedComment[];
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  commentsFor: (postId: string) => FeedComment[];
  addPost: (caption: string, outletName?: string, brandId?: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: initialPosts,
  comments: initialComments,
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
