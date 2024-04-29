"use client";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";

export const NewVerificationForm = () => {
  const params = useSearchParams();
  const token = params.get("token");

  return (
    <CardWrapper
      backButtonHref='/'
      backButtonLabel='Back to home'
      headerLabel='Confirming your email'
    >
      <div className='flex items-center w-full justify-center'>
        <BeatLoader />
      </div>
    </CardWrapper>
  );
};
