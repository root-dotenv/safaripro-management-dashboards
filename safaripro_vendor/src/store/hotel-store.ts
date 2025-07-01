import { create } from "zustand";

export const useHotelStore = create(() => ({
  hotel: {
    name: "Serena Hotel",
  },
  location: "Dar es Salaam Tanzania",
}));
