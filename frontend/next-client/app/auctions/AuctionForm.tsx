'use client';

import { Button, HelperText, Spinner, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { FieldValues, useForm } from 'react-hook-form';

export default function AuctionForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: {isSubmitting, isValid, isDirty, errors}
  } = useForm();
  
  function onSumbit(data: FieldValues): void {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSumbit)} 
      className="flex flex-col mt-3"
    >
      <div className="mb-3 block">
        <TextInput 
          {...register('make', {required: 'Make is required'})}
          color={errors?.make && 'failure'}
          placeholder="Make"
        />
        <HelperText color="failure">
          {errors.make?.message as string}
        </HelperText>
      </div>

      <div className="mb-3 block">
        <TextInput 
          {...register('model', {required: 'Model is required'})}
          color={errors?.model && 'failure'}
          placeholder="Model"
        />
        <HelperText color="failure">
          {errors.model?.message as string}
        </HelperText>
      </div>

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
