"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewPasswordFormSchema } from "@/schemas";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import {
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { updatePasswordResetToken } from "@/lib/tokens";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");

  const params = useSearchParams();
  const token = params.get("token");

  const form = useForm<
    z.infer<typeof NewPasswordFormSchema>
  >({
    resolver: zodResolver(NewPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleOnSubmit(
    values: z.infer<typeof NewPasswordFormSchema>
  ) {
    setError("");
    setsuccess("");
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startTransition(async () => {
      if (!token) {
        setError("Invalid token");
        return;
      }
      const message = await updatePasswordResetToken({
        token,
        values,
      });
      if (message?.error) {
        setError(message.error);
      }

      if (message?.success) {
        setsuccess(message.success);
      }
    });
  }

  const onSubmit = useCallback(handleOnSubmit, [token]);

  return (
    <CardWrapper
      backButtonLabel='Back to login'
      headerLabel='Update Password'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form
          className='space-y-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            className='w-full'
            variant={"destructive"}
            type='submit'
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending
              ? "updating..."
              : "Update Password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
