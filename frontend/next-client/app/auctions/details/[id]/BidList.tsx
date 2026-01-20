'use client';

import { getBidsForAuction } from '@/app/actions';
import Heading from '@/app/components/Heading';
import { useBidStore } from '@/hooks';
import { Auction, Bid } from '@/models';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BidItem from './BidItem';
import { numberWithCommas } from '@/lib';
import EmptyFilter from '@/app/components/EmptyFilter';
import BidForm from './BidForm';

interface Props {
  user: User | null;
  auction: Auction;
}

export default function BidList({user, auction}: Props) {
  const [loading, setLoading] = useState(true);
  const bids = useBidStore(state => state.bids);
  const setBids = useBidStore(state => state.setBids);

  const highBid = bids.reduce((prev, current) => prev > current.amount ? prev : current.amount, 0);

  useEffect(() => {
    getBidsForAuction(auction.id)
      .then((response: any) => {
        if (response.error) {
          throw response.error;
        }

        setBids(response as Bid[]);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [auction.id, setBids]);

  if (loading) {
    return <span>Loading bids...</span>
  }

  return (
    <div className="rounded-lg shadow-md">
      <div className="px-4 py-2 bg-white">
        <div className="sticky top-0 bg-white p-2">
          <Heading title={`Current high bid is $${numberWithCommas(highBid)}`} />
        </div>
      </div>

      <div className="overflow-auto h-87.5 flex flex-col-reverse px-2">
        {bids.length === 0 ? (
          <EmptyFilter
            title='No bids for this item'
            subtitle="Please feel free to make a bid" 
          />
        ) : (
          <>
            {bids.map(bid => (
              <BidItem 
                key={bid.id} 
                bid={bid} 
              />
            ))}
          </>
        )}
      </div>
      
      <div className="px-2 pb-2 text-gray-500">
        {!open ? (
          <div className="flex items-center justify-center p-2 text-lg font-semibold">
            This auction has finished
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center p-2 text-lg font-semibold">
            Please login to place a bid
          </div>
        ) : user && user.username === auction.seller ? (
          <div className="flex items-center justify-center p-2 text-lg font-semibold">
            You cannot bid on your own auction
          </div>
        ) : (
          <BidForm 
            auctionId={auction.id} 
            highBid={highBid} 
          />
        )}
      </div>
    </div>
  )
}
