import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardContent } from "../ui/card";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      backButtonHref='/auth/login'
      headerLabel='Oops, Something went wrong!'
      backButtonLabel='Back to login'
    >
      <CardContent>
        <div className='w-full flex items-center justify-center'>
          <ExclamationTriangleIcon
            className='text-destructive'
            width={50}
            height={50}
          />
        </div>
      </CardContent>
    </CardWrapper>
  );
};
