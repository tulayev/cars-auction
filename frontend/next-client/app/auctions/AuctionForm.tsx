'use client';

import { Button, Spinner } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../components/Input';
import { useEffect } from 'react';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions';
import toast from 'react-hot-toast';
import { Auction } from '@/models';

interface Props {
  auction?: Auction;
}

export default function AuctionForm({auction}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: {isSubmitting, isValid, isDirty}
  } = useForm({
    mode: 'onTouched'
  });
  
  useEffect(() => {
    if (auction) {
      const {make, model, color, mileage, year} = auction;
      reset({make, model, color, mileage, year});
    }
    setFocus('make');
  }, [setFocus, auction, reset]);

  async function onSumbit(data: FieldValues): Promise<void> {
    try {
      let id = '';
      let response;

      if (pathname === '/auctions/create') {
        response = await createAuction(data);
        id = response.id;
      } else {
        if (auction) {
          response = await updateAuction(data, auction.id);
          id = auction.id;
        }
      }

      if (response.error) {
          throw response.error;
      }

      router.push(`/auctions/details/${id}`);
    } catch (error: any) {
      toast.error(`${error.status} ${error.message}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSumbit)} 
      className="flex flex-col mt-3"
    >
      <Input 
        name="make"
        label="Make"
        control={control}
        rules={{required: 'Make is required'}}
      />

      <Input 
        name="model"
        label="Model"
        control={control}
        rules={{required: 'Model is required'}}
      />

      <Input 
        name="color"
        label="Color"
        control={control}
        rules={{required: 'Color is required'}}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input 
          name="year"
          label="Year"
          type="number"
          control={control}
          rules={{required: 'Year is required'}}
        />

        <Input 
          name="mileage"
          label="Mileage"
          control={control}
          rules={{required: 'Mileage is required'}}
        />
      </div>
      
      {pathname === '/auctions/create' && 
        <>
          <Input 
            name="imageUrl"
            label="Image URL"
            control={control}
            rules={{required: 'Image URL is required'}}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input 
              name="reservePrice"
              label="Reserve price (enter 0 if no reserve)"
              type="number"
              control={control}
              rules={{required: 'Reserve price is required'}}
            />

            <DateInput 
              name="auctionEnd"
              label="Auction end date/time"
              control={control}
              rules={{required: 'Auction end date is required'}}
              dateFormat="dd MMMM yyyy h:mm a"
              showTimeSelect
            />
          </div>
        </>
      }

      <div className="flex justify-between">
        <Button
          color="alternative"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
        <Button
          color="green"
          type="submit"
          disabled={!isValid || !isDirty}
          outline
        >
          {isSubmitting && <Spinner size="sm" />}
          Submit
        </Button>
      </div>
    </form>
  )
}
