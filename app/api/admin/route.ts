import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const role = user?.role;

    console.log("user", user);

    if (role === UserRole.ADMIN) {
      return new NextResponse("Is Admin", {
        status: 200,
      });
    }
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, {
      status: 400,
    });
  }

  return new NextResponse("Forbidden", {
    status: 403,
  });
}
