'use client';

import { placeBidForAuction } from '@/app/actions';
import { useBidStore } from '@/hooks';
import { numberWithCommas } from '@/lib';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
  auctionId: string;
  highBid: number;
}

export default function BidForm({auctionId, highBid}: Props) {
  const {register, handleSubmit, reset} = useForm();
  const addBid = useBidStore(state => state.addBid);

  function onSubmit(data: FieldValues) {
    if (data.amount <= highBid) {
      reset();
      return toast.error(`Bid must be at least $${numberWithCommas(highBid + 1)}`);
    }

    placeBidForAuction(auctionId, +data.amount)
      .then(bid => {
        if (bid.error) {
          reset();
          throw bid.error;
        }
        addBid(bid);
        reset();
      })
      .catch(error => {
        console.error(error);
        toast.error(error.message);
      });
  }

  return (
    <form
      className="flex items-center border-2 rounded-lg py-2" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <input 
        {...register('amount')}
        type="number"
        className="input-custom text-sm text-gray-600"
        placeholder={`Enter your bid (minimum bid is $${numberWithCommas(highBid + 1)})`}
      />
    </form>
  )
}
