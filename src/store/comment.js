import { create } from 'zustand';

export const useCommentStore = create((set, get) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: async (contentId, userId, text) => {
    const res = await fetch(`${API_URL}/api/comment/addComment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentId, userId, text }),
    })
    const data = await res.json();
    set((state) => ({ comments: [...state.comments, data.data] }));
    return data;
  },
  getCommentsByContentId: async (contentId) => {
    try {
      const res = await fetch(`${API_URL}/api/comment/getCommentsByContentId/${contentId}`);
      const data = await res.json();
      set({ comments: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Error fetching comments:', error);
      set({ comments: [] });
    }
  }
}));