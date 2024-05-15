"use client";

import { logout } from "@/actions/logout";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import useCurrentUser from "@/hooks/use-current-user";

const SettingsPage = () => {
  const [error, setError] = useState<string | undefined>(
    ""
  );
  const [success, setsuccess] = useState<
    string | undefined
  >("");
  const [isPending, startTransition] = useTransition();
  const { user } = useCurrentUser();
  const { update, data } = useSession();
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
    },
  });

  const onSubmit = (
    values: z.infer<typeof SettingsSchema>
  ) => {
    startTransition(() => {
      settings({ name: "Boog" })
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setsuccess(data.success);
          }
        })
        .catch(() => {
          setError(
            "Something went wrong updating your profile"
          );
        });
    });
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          ⚙️ Settings
        </p>
      </CardHeader>
      {user ? (
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!user?.isOAuth && (
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {error && <FormError message={"test"} />}
              {success && <FormSuccess message={success} />}
              <Button type='submit'>Save</Button>
            </form>
          </Form>
        </CardContent>
      ) : (
        "Loading..."
      )}
    </Card>
  );
};

export default SettingsPage;
