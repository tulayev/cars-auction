'use client';

import { Auction } from '@/models';
import AuctionCard from './AuctionCard';
import AppPagination from '../components/AppPagination';
import { useEffect, useState } from 'react';
import { getData } from '../actions';

export default function Listings() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    getData(pageNumber).then(data => {
      setAuctions(data.results);
      setPageCount(data.pageCount);
    })
  }, [pageNumber]);

  if (auctions.length === 0) {
    return <h3>Loading...</h3>
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {auctions && auctions.map(auction => (
          <AuctionCard 
            key={auction.id} 
            auction={auction} 
          />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <AppPagination 
          currentPage={pageNumber}
          pageCount={pageCount}
          pageChanged={setPageNumber}
        />
      </div>
    </>
  )
}
