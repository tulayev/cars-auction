import EmptyFilter from '@/app/components/EmptyFilter';

export default function SignIn({searchParams}: {searchParams: {callBackUrl: string}}) {
  return (
    <EmptyFilter 
      title="You need to be logged in to do that"
      subtitle="Please click below to login"
      callBackUrl={searchParams.callBackUrl}
      showLogin
    />
  )
}
