import { getCurrentUser, getDetailedViewData } from '@/app/actions';
import Heading from '@/app/components/Heading';
import CountdownTimer from '../../CountdownTimer';
import CarImage from '../../CarImage';
import DetailedSpecs from './DetailedSpecs';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import BidItem from './BidItem';
import BidList from './BidList';

export default async function Details({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const auction = await getDetailedViewData(id);
  const user = await getCurrentUser();
  
  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Heading title={`${auction.make} ${auction.model}`} />
          {user?.username === auction.seller && (
            <>
              <EditButton id={auction.id} />
              <DeleteButton id={auction.id} />
            </>
          )}
        </div>
        <div className="flex gap-3">
          <h3 className="text-2xl font-semibold">Time remaining:</h3>
          <CountdownTimer auctionEnd={auction.auctionEnd} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-3">
        <div className="relative w-full bg-gray-200 aspect-16/10 rounded-lg overflow-hidden">
          <CarImage 
            imageUrl={auction.imageUrl} 
            model={auction.model} 
          />
        </div>
        <BidList 
          user={user} 
          auction={auction} 
        />
      </div>

      <div className="mt-3 grid grid-cols-1 rounded-lg">
        <DetailedSpecs auction={auction} />
      </div>
    </>
  )
}
