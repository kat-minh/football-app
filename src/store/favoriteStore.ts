import {create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player } from "../types/player";

type FavoriteStore = {
  favorites: Player[]
  toggleFavorite: (player: Player) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteStore>()(
 persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (player) => {
        const { favorites } = get();
        const isFavorite = favorites.some((p) => p.id === player.id);

        if (isFavorite) {
          set({ favorites: favorites.filter((p) => p.id !== player.id) });
        } else {
          set({ favorites: [...favorites, player] });
        }
      },

      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some((p) => p.id === id);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorite-storage",
      storage: {
        getItem: async (name) => {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
            await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
            await AsyncStorage.removeItem(name);
        },
      }
    }
 )
);

