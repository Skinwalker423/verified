import React from "react";

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='h-full flex items-center justify-center blue-gradient'>
      {children}
    </div>
  );
};

export default AuthLayout;