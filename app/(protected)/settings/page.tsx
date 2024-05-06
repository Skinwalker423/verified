"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  return (
    <div className='bg-white'>
      SettingsPage
      <Button onClick={() => logout()}>Sign Out</Button>
    </div>
  );
};

export default SettingsPage;
