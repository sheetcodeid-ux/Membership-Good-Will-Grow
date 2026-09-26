import { create } from "zustand";

export interface ChatMessage {
  id: string;
  from: "me" | "outlet";
  text: string;
  at: number;
}

interface ChatState {
  /** Conversations with the outlet, one per order id. */
  threads: Record<string, ChatMessage[]>;
  send: (orderId: string, from: ChatMessage["from"], text: string) => void;
}

let seq = 1;

export const useChatStore = create<ChatState>((set) => ({
  threads: {},
  send: (orderId, from, text) =>
    set((s) => ({
      threads: {
        ...s.threads,
        [orderId]: [
          ...(s.threads[orderId] ?? []),
          { id: `m-${seq++}`, from, text, at: Date.now() },
        ],
      },
    })),
}));
