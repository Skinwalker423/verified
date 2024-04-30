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
import { ResetFormSchema } from "@/schemas";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { reset } from "@/actions/reset";

export const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");
  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(
    values: z.infer<typeof ResetFormSchema>
  ) {
    setError("");
    setsuccess("");
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startTransition(async () => {
      const message = await reset({ email: values.email });
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
      backButtonLabel='Back to login'
      headerLabel='Reset your password'
      backButtonHref='/auth/login'
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            className='w-full'
            variant={"destructive"}
            type='submit'
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending
              ? "Verifying..."
              : "Send reset email"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
