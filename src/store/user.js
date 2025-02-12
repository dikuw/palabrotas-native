import { create } from 'zustand';
import { API_URL } from '../config/env';

export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  updateStreak: async (userId) => {
    const res = await fetch(`${API_URL}/api/user/updateStreak/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  },

  getCurrentStreak: async (userId) => {
    const res = await fetch(`${API_URL}/api/user/getCurrentStreak/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  }, 

  getLongestStreak: async (userId) => {
    const res = await fetch(`${API_URL}/api/user/getLongestStreak/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  }, 

  getAppIntro: async (userId) => {
    const res = await fetch(`${API_URL}/api/user/getAppIntro/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  },

  setAppIntro: async (userId, intro) => {
    const res = await fetch(`${API_URL}/api/user/setAppIntro/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  }
}));