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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import useCurrentUser from "@/hooks/use-current-user";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  const [error, setError] = useState<string | undefined>(
    ""
  );
  const [success, setsuccess] = useState<
    string | undefined
  >("");
  const [isPending, startTransition] = useTransition();
  const { user } = useCurrentUser();
  const { update } = useSession();
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled,
      role: user?.role,
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = (
    values: z.infer<typeof SettingsSchema>
  ) => {
    console.log("submitting");
    startTransition(() => {
      settings({
        name: values.name ? values.name : undefined,
        email: values.email ? values.email : undefined,
        password: values.password
          ? values.password
          : undefined,
        newPassword: values.newPassword
          ? values.newPassword
          : undefined,
        role:
          user?.role === values.role
            ? undefined
            : values.role,
      })
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
                    <Input
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!user?.isOAuth && (
              <div>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type='email'
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
                          {...field}
                          disabled={isPending}
                          placeholder='******'
                          type='password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='newPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type='password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue
                          placeholder={"Select a role"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.USER}>
                        {UserRole.USER}
                      </SelectItem>
                      <SelectItem value={UserRole.ADMIN}>
                        {UserRole.ADMIN}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isTwoFactorEnabled'
              render={({ field }) => (
                <FormItem className='flex justify-between items-center border px-3 py-4 rounded-lg shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>
                      Two Factor Authentication
                    </FormLabel>
                    <FormDescription>
                      Enable two-factor authentication (2FA)
                      for added security
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button disabled={isPending} type='submit'>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
