import { Auction, PagedResult } from '@/models';
import { create } from 'zustand';

interface State {
  auctions: Auction[];
  pageCount: number;
  totalCount: number;
}

interface Actions {
  setAuctionsData: (data: PagedResult<Auction>) => void;
  setCurrentPrice: (auctionId: string, amount: number) => void;
}

const initialState: State = {
  auctions: [],
  pageCount: 0,
  totalCount: 0
};

export const useAuctionStore = create<State & Actions>((set) => ({
  ...initialState,

  setAuctionsData: (data: PagedResult<Auction>) => {
    set(() => ({
      auctions: data.results,
      pageCount: data.pageCount,
      totalCount: data.totalCount
    }))
  },

  setCurrentPrice: (auctionId: string, amount: number) => {
    set((state) => ({
      auctions: state.auctions.map((auction) => auction.id === auctionId
        ? {...auction, currentHighBid: amount}
        : auction)
    }))
  }
}));
