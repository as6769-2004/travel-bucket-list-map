import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userId: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: (userData, isAdmin = false) => {
        set({
          user: userData,
          userId: userData.id,
          isAuthenticated: true,
          isAdmin
        });
      },
      
      logout: () => {
        set({
          user: null,
          userId: null,
          isAuthenticated: false,
          isAdmin: false
        });
      },
      
      getUser: () => get().user,
      getUserId: () => get().userId,
      checkAuth: () => get().isAuthenticated
    }),
    {
      name: 'auth-storage'
    }
  )
);