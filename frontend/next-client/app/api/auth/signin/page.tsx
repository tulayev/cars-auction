import EmptyFilter from '@/app/components/EmptyFilter';

export default async function SignIn({searchParams}: {searchParams: Promise<{callBackUrl: string}>}) {
  const {callBackUrl} = await searchParams;
  
  return (
    <EmptyFilter 
      title="You need to be logged in to do that"
      subtitle="Please click below to login"
      callBackUrl={callBackUrl}
      showLogin
    />
  )
}
