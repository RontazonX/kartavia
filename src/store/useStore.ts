import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: 'IDR' | 'USD';
}

interface AppState {
  preferences: UserPreferences;
  wishlist: string[]; // array of destination IDs
  setTheme: (theme: UserPreferences['theme']) => void;
  setCurrency: (currency: UserPreferences['currency']) => void;
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      preferences: {
        theme: 'system',
        currency: 'IDR',
      },
      wishlist: [],
      
      setTheme: (theme) => set((state) => ({ 
        preferences: { ...state.preferences, theme } 
      })),
      
      setCurrency: (currency) => set((state) => ({ 
        preferences: { ...state.preferences, currency } 
      })),
      
      addToWishlist: (id) => set((state) => {
        if (!state.wishlist.includes(id)) {
          return { wishlist: [...state.wishlist, id] };
        }
        return state;
      }),
      
      removeFromWishlist: (id) => set((state) => ({
        wishlist: state.wishlist.filter((itemId) => itemId !== id)
      })),
      
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'kartavia-storage', // name of the item in the storage (must be unique)
    }
  )
);
