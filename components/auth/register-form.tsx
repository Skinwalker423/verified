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
import { RegisterFormSchema } from "@/schemas";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { useState, useTransition } from "react";
import { register } from "@/actions/register";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(
    values: z.infer<typeof RegisterFormSchema>
  ) {
    setError("");
    setsuccess("");
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startTransition(async () => {
      const message = await register(values);
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
      backButtonLabel='Already have an account? Sign in'
      headerLabel='Create an Account'
      backButtonHref='/auth/login'
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
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder={"Joeblow"}
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
                    placeholder={"******"}
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
              ? "Creating account..."
              : "Create an account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
