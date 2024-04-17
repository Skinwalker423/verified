import { CardWrapper } from "./card-wrapper";

export const LoginForm = () => {
  return (
    <CardWrapper
      backButtonLabel="Don't have an account?"
      header='Welcome Back!'
      backButtonHref='/auth/register'
      showSocial
    >
      <form action=''>
        <input
          placeholder='123@gmail.com'
          type='text'
          name=''
          id=''
        />
        <input
          placeholder='password'
          type='password'
          name=''
          id=''
        />
      </form>
    </CardWrapper>
  );
};
