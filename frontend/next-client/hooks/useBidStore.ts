import { Bid } from "@/models";
import { create } from "zustand";

interface State {
  bids: Bid[];
}

interface Actions {
  setBids: (bids: Bid[]) => void;
  addBid: (bid: Bid) => void;
}

export const useBidStore = create<State & Actions>((set) => ({
  bids: [],

  setBids: (bids: Bid[]) => {
    set(() => ({
      bids
    }))
  },

  addBid: (bid: Bid) => {
    set((state) => ({
      bids: !state.bids.find(x => x.id === bid.id) ? [bid, ...state.bids] : [...state.bids]
    }))
  }
}));
