import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

import { LogoutButton } from "./logout-button";
import useCurrentUser from "@/hooks/use-current-user";

export const UserButton = () => {
  const { user } = useCurrentUser();
  console.log("user", user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={
              user?.image
                ? user.image
                : "https://github.com/shadcn.pn"
            }
          />
          <AvatarFallback className='bg-stone-200 text-stone-500 shadow-sm hover:bg-stone-300/90'>
            <FaUser size={24} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className='flex gap-3'>
            <FaSignOutAlt size={20} />
            Sign Out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
