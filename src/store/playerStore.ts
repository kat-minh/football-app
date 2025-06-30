import { create } from "zustand";
import { getAllPlayers, getPlayerById } from "../services/playerService";
import { Player } from "../types/player";

interface PlayerStore {
  players: Player[];
  player: Player | null;
  isLoading: boolean;
  isPlayerSearching: boolean;
  error: string | null;
  setPlayer: (player: Player | null) => void;
  fetchPlayers: () => Promise<void>;
  fetchPlayerById: (id: string) => Promise<Player | null>;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  player: null,
  isLoading: false,
  isPlayerSearching: false,
  error: null,

  setPlayer: (player: Player | null) => {
    set({ player });
  },

  fetchPlayers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAllPlayers();
      set({ players: data, isLoading: false });
    } catch (error: any) {
      console.error("Fetch failed", error);
      set({ error: error.message || "Lỗi xảy ra", isLoading: false });
    }
  },

  fetchPlayerById: async (id: string) => {
    set({ isPlayerSearching: true, error: null });
    try {
      const player = await getPlayerById(id);

      if (!player) {
        set({ error: "Cầu thủ không tồn tại", isPlayerSearching: false });
        return null;
      }

      set({ player, isPlayerSearching: false, error: null });
      return player;
    } catch (error: any) {
      console.error("Fetch by ID failed", error);
      set({ error: error.message || "Lỗi xảy ra", isPlayerSearching: false });
      return null;
    }
  },
}));
