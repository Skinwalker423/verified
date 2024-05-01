import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "password required",
  }),
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
