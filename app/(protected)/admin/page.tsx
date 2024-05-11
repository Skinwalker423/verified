"use client";

import { admin } from "@/actions/admin";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState("");
  const [error, setError] = useState("");

  const handleAdminServerAction = async () => {
    setError("");
    setIsAdmin("");
    const { error, success } = await admin();
    if (error) {
      setError(error);
      toast.error("Forbidden", {
        style: {
          background: "red",
          color: "white",
        },
        description:
          "You are not authorized to use this server action",
        closeButton: true,
      });

      return;
    }
    if (success) setIsAdmin(success);
    toast.success("Success!", {
      style: {
        background: "green",
        color: "white",
      },
      description: "Admin server action successfully done",
      action: {
        label: "More info",
        onClick: () =>
          console.log("redirecting for more info"),
      },
    });
  };
  const handleAdminApi = async () => {
    const res = await fetch(
      "http://localhost:3000/api/admin"
    );

    console.log("res", res);

    if (!res.ok) {
      console.log("is admin");
      toast.success("Success!", {
        style: {
          background: "green",
          color: "white",
        },
        description: "Admin api function successfully done",
        action: {
          label: "More info",
          onClick: () =>
            console.log("redirecting for more info"),
        },
      });
    } else {
      console.log("forbidden");
      toast.error("Forbidden", {
        style: {
          background: "red",
          color: "white",
        },
        description:
          "You are not authorized to use this api",
        closeButton: true,
      });
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
        <div className='flex justify-between items-center w-full border border-slate-200 px-2 py-4 rounded-lg'>
          <h3>Admin only API route</h3>
          <Button onClick={handleAdminApi}>Test</Button>
        </div>
        <div className='flex justify-between items-center w-full border border-slate-200 px-2 py-4 rounded-lg'>
          <h3>Admin only server action</h3>
          <Button onClick={handleAdminServerAction}>
            Test
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        {isAdmin && <FormSuccess message={isAdmin} />}
        {error && <FormError message={error} />}
      </CardFooter>
    </Card>
  );
};

export default AdminPage;
