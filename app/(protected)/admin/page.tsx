"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { UserRole } from "@prisma/client";

const AdminPage = () => {
  const handleAdminApi = async () => {
    const res = await fetch(
      "http://localhost:3000/api/admin"
    );

    console.log("res", res);

    if (res.ok) {
      console.log("is admin");
    } else {
      console.log("forbidden");
    }
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          🔑 Admin
        </p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <h1>Content for all</h1>
        <RoleGate allowedRole={UserRole.ADMIN}>
          For admins only: Keep it going!
        </RoleGate>
        <div>
          <h3>Admin only API route</h3>
          <Button onClick={handleAdminApi}>Test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
