import api from "../config/axios";

export async function getAllPlayers() {
  try {
    const response = await api.get("/player");
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
}

export async function getPlayerById(id: string) {
  try {
    const response = await api.get(`/player/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with id ${id}:`, error);
    throw error;
  }
}