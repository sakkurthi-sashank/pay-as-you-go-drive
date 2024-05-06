import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  isUserLoading: boolean
  setIsUserLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isUserLoading: true,
  setIsUserLoading: (loading) => set({ isUserLoading: loading }),
}))
