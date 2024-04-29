"use client";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { updateVerificatonToken } from "@/lib/tokens";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>(
    ""
  );
  const [success, setsuccess] = useState<
    string | undefined
  >("");
  const params = useSearchParams();
  const token = params.get("token");

  const onSubmit = useCallback(() => {
    setError("");
    setsuccess("");
    console.log(token);
    if (!token) {
      setError("Missing token");
      return;
    }
    updateVerificatonToken(token).then((data) => {
      if (data?.error) {
        setError(data.error);
      }

      if (data?.success) {
        setsuccess(data.success);
      }
    });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      backButtonHref='/'
      backButtonLabel='Back to home'
      headerLabel='Confirming your email'
    >
      <div className='flex items-center w-full justify-center'>
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
