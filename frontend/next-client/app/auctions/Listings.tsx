'use client';

import { Auction, PagedResult } from '@/models';
import AuctionCard from './AuctionCard';
import AppPagination from '../components/AppPagination';
import { useEffect, useState } from 'react';
import { getData } from '../actions';
import Filters from './Filters';
import { useParamsStore } from '@/hooks';
import { useShallow } from 'zustand/shallow';
import qs from 'query-string';
import EmptyFilter from '../components/EmptyFilter';

export default function Listings() {
  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useParamsStore(useShallow(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy
  })));
  const setParams = useParamsStore(state => state.setParams);
  const url = qs.stringifyUrl({url: '', query: params}, {skipEmptyString: true});

  function setPageNumber(pageNumber: number): void {
    setParams({pageNumber});
  }

  useEffect(() => {
    getData(url).then(data => {
      setData(data);
    })
  }, [url]);

  if (!data) {
    return <h3>Loading...</h3>
  }

  return (
    <>
      <Filters />

      {data.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {data && data.results.map(auction => (
              <AuctionCard 
                key={auction.id} 
                auction={auction} 
              />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <AppPagination 
              currentPage={params.pageNumber}
              pageCount={data.pageCount}
              pageChanged={setPageNumber}
            />
          </div>
        </>
      )}
    </>
  )
}
