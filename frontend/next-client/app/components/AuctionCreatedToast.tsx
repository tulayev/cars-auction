import { Auction } from '@/models';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  auction: Auction;
}

export default function AuctionCreatedToast({auction}: Props) {
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
        <span>New auction: {auction.make} {auction.model} has been added</span>
      </div>
    </Link>
  )
}
