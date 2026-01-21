import { numberWithCommas } from '@/lib';
import { Auction, AuctionFinished } from '@/models';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  auction: Auction;
  finishedAuction: AuctionFinished;
}

export default function AuctionFinishedToast({auction, finishedAuction}: Props) {
  return (
    <Link 
      href={`/auctions/details/${auction.id}`}
      className="flex flex-col items-center"
    >
      <div className="flex flex-row items-center gap-2">
        <Image 
          src={auction.imageUrl}
          alt={auction.model}
          width={80}
          height={80}
          className="rounded-lg w-auto h-auto"
        />
        <div className="flex flex-col">
          <span>Auction for {auction.make} {auction.model} has finished</span>
          {finishedAuction.itemSold && finishedAuction.amount ? (
            <p>
              Congrats to {finishedAuction.winner} who has won this auction  ${numberWithCommas(finishedAuction.amount)}
            </p>
          ) : (
            <p>This item did not sell</p>
          )}
        </div>
      </div>
    </Link>
  )
}
