"use client";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ClockLoader } from "react-spinners";

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
  const [showTwoFactor, setShowTwoFactor] = useState(false);
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
    setShowTwoFactor(false);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startTransition(async () => {
      const message = await login(values);

      if (message.error) {
        form.reset();
        setError(message.error);
      }

      if (message.success) {
        form.reset();
        setsuccess(message.success);
      }

      if (message.twoFactor) {
        console.log("2fa", message.twoFactor);
        setShowTwoFactor(true);
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
          <div className='space-y-5'>
            {!showTwoFactor ? (
              <>
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
                          disabled={
                            isSubmitting || isPending
                          }
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
                          disabled={
                            isSubmitting || isPending
                          }
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
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two-Factor Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='123456'
                          disabled={
                            isSubmitting || isPending
                          }
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormError message={error || paramsError} />
            <FormSuccess message={success} />
            <Button
              className='w-full'
              variant={"destructive"}
              type='submit'
              disabled={isSubmitting || isPending}
            >
              {showTwoFactor ? "Confirm" : "Login"}{" "}
              <span>
                {isSubmitting ||
                  (isPending && <ClockLoader />)}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
