import useCurrentUser from "@/hooks/use-current-user";
import type { UserRole } from "@prisma/client";
import { PropsWithChildren } from "react";
import { FormError } from "./form-error";

interface RoleGateProps extends PropsWithChildren {
  allowedRole: UserRole;
}

export const RoleGate = ({
  children,
  allowedRole,
}: RoleGateProps) => {
  const { user } = useCurrentUser();

  const role = user?.role;

  if (allowedRole !== role) {
    return (
      <FormError
        message={
          "You do not have permission to view this content"
        }
      />
    );
  }

  return <>{children}</>;
};
