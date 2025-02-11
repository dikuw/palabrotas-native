import { create } from 'zustand';
import { API_URL } from '../config/env';

export const useAuthStore = create(
    (set, get) => ({
      authStatus: { isLoggedIn: false, user: null, isLoading: true },
      registerUser: async (newUser) => {
        const res = await fetch(`${API_URL}/api/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
        const data = await res.json();
        if (data.authenticated) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          throw new Error(data.message);
        }
      },
      googleLogin: async () => {
        try {
          // Instead of trying to parse JSON, we'll redirect to the Google auth URL
          window.location.href = `${API_URL}/api/auth/google`;
          // Note: The actual auth status update will happen when Google redirects back
          // and getCurrentUser is called
        } catch (error) {
          console.error('Error during Google login:', error);
          throw error;
        }
      },
      loginUser: async (credentials) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: 'include',
        })
        const data = await res.json();
        if (data.authenticated) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          throw new Error(data.message);
        }
      },
      logoutUser: async () => {
        try {
          const data = await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
          set({ authStatus: { isLoggedIn: false, user: null, isLoading: false } });
          return data;
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
      getCurrentUser: async () => {
        const res = await fetch(`${API_URL}/api/auth/getUser`, {
          method: "GET",
          credentials: 'include',
        })
        const data = await res.json();
        if (data.user) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          set({ 
            authStatus: { 
              isLoggedIn: false, 
              user: null, 
              isLoading: false 
            } 
          });
        }
        return data;
      },
      updateUser: async (user) => {
        const res = await fetch(`${API_URL}/api/user/update`, {
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(user),
        })
        const data = await res.json();
        if (data.user) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          throw new Error('Update failed');
        }
        return data;
      },
    }),
);