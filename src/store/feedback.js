import { create } from 'zustand';
import { API_URL } from '../config/env';

export const useFeedbackStore = create((set, get) => ({
  feedback: [],
  setFeedback: (feedback) => set({ feedback }),
  addFeedback: async (newFeedback) => {
    const res = await fetch(`${API_URL}/api/feedback/addFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFeedback),
    });
    const data = await res.json();
    set((state) => ({ feedback: [...state.feedback, data.data] }));
    return data;
  },
}));