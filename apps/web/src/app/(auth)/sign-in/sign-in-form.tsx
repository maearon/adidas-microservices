"use client";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/useTranslations";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SocialLoginButtons from "@/app/(auth)/account-login/SocialLoginButtons"

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      toast.success("Signed in successfully");
      router.push(redirect ?? "/my-account");
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect ?? "/my-account",
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Login preference OR Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex w-full flex-col items-center justify-between gap-2">
              <SocialLoginButtons />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Keep me logged in */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="keepLoggedIn"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="keepLoggedIn" className="text-base">
                    {t?.keepMeLoggedIn || "Keep me logged in. Applies to all options."}{" "}
                    <button type="button" className="underline ml-1">
                      {t?.moreInfo || "More info"}
                    </button>
                  </FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              border
              theme="black"
              showArrow
              pressEffect
              shadow
              loading={loading}
              type="submit"
              className="w-full py-3 font-semibold transition-colors"
            >
              {t?.logIn || "LOG IN"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
