"use client";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
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
import { LoginFormSchema } from "@/schemas";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { login } from "@/actions/login";
import Link from "next/link";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const params = useSearchParams();
  const paramsError =
    params.get("error") === "OAuthAccountNotLinked"
      ? "Email is already in use with another provider. Sign in using original provider."
      : "";

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(
    values: z.infer<typeof LoginFormSchema>
  ) {
    setError("");
    setsuccess("");
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startTransition(async () => {
      const message = await login(values);
      if (message.error) {
        setError(message.error);
      }

      if (message.success) {
        setsuccess(message.success);
      }
    });
  }

  return (
    <CardWrapper
      backButtonLabel="Don't have an account?"
      headerLabel='Welcome Back!'
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form
          className='space-y-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='123@gmail.com'
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
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={"******"}
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>
                <Button
                  variant={"link"}
                  size={"sm"}
                  asChild
                  className='px-0 font-normal'
                >
                  <Link href={"/auth/reset"}>
                    Forgot password?
                  </Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error || paramsError} />
          <FormSuccess message={success} />
          <Button
            className='w-full'
            variant={"destructive"}
            type='submit'
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending
              ? "Logging in..."
              : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
