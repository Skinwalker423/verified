import { UserRole } from "@prisma/client";
import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "password required",
  }),
  code: z.optional(z.string()),
});
export const ResetFormSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const RegisterFormSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    name: z.string().min(1, {
      message: "Name must entered",
    }),
    password: z.string().min(8, {
      message: "password required",
    }),
    confirmPassword: z.string().min(8, {
      message: "password required",
    }),
  })
  .refine(
    ({ password, confirmPassword }) =>
      password === confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const NewPasswordFormSchema = z
  .object({
    password: z.string().min(8, {
      message: "password required",
    }),
    confirmPassword: z.string().min(8, {
      message: "password required",
    }),
  })
  .refine(
    ({ password, confirmPassword }) =>
      password === confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const SettingsSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "Name must entered",
      })
      .optional(),
    email: z.string().email().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z
      .enum([UserRole.ADMIN, UserRole.USER])
      .optional(),
    password: z
      .string()
      .min(6, {
        message: "Password requires at least 6 characters",
      })
      .optional(),
    newPassword: z
      .string()
      .min(8, {
        message: "password required",
      })
      .optional(),
  })
  .refine(
    ({ password, newPassword }) => password !== newPassword,
    {
      message: "New password cannot be the same as the old",
      path: ["newPassword"],
    }
  )
  .refine(
    ({ password, newPassword }) => {
      if (
        (password && !newPassword) ||
        (newPassword && !password)
      ) {
        return false;
      }

      return true;
    },
    {
      message:
        "Both Old password and new password are required",
      path: ["newPassword"],
    }
  );
