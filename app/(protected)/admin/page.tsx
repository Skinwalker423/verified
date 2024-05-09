"use client";

import { RoleGate } from "@/components/auth/role-gate";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { UserRole } from "@prisma/client";

const AdminPage = () => {
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
      </CardContent>
    </Card>
  );
};

export default AdminPage;
