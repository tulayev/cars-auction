'use server';

import { fetchWrapper } from '@/lib';
import { PagedResult, Auction, Bid } from '@/models';
import { FieldValues } from 'react-hook-form';

export async function getData(query: string): Promise<PagedResult<Auction>> {
  return fetchWrapper.get(`search${query}`);
}

export async function getDetailedViewData(id: string): Promise<Auction> {
  return fetchWrapper.get(`auctions/${id}`);
}

export async function createAuction(data: FieldValues): Promise<any> {
  return fetchWrapper.post('auctions', data);
}

export async function updateAuction(data: FieldValues, id: string): Promise<any> {
  return fetchWrapper.put(`auctions/${id}`, data);
}

export async function updateAuctionTest(): Promise<{status: number, message: string}> {
  const data = {
    mileage: Math.floor(Math.random() * 10000) + 1
  };

  return fetchWrapper.put('auctions/123', data);
}

export async function deleteAuction(id: string): Promise<any> {
  return fetchWrapper.del(`auctions/${id}`);
}

export async function getBidsForAuction(id: string): Promise<Bid[]> {
  return fetchWrapper.get(`bids/${id}`);
}
