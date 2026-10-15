"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { loginAction } from "../action/auth.action";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      console.log(data);
      router.push("/dashboard");

      setUser(data.user);
      toast.add({
        type: "success",
        title: "Login successful",
        description: "You have successfully logged in.",
      });
    },
    onError: (error) => {
      form.setError("password", {
        type: "server",
        message: error.message,
      });
      toast.add({ type: "error", title: error.message });
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500 text-lg font-bold">
                C
              </div>
              <span className="text-lg font-semibold tracking-tight">
                CampusHub
              </span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              College management
            </p>
            <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
              Everything your campus needs, in one place.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              Manage courses, attendance, assignments, and student progress with
              a simpler academic workspace.
            </p>
          </div>
          <p className="text-sm text-slate-400">
            A smarter way to manage your college.
          </p>
        </section>

        <section className="p-7 sm:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                  C
                </div>
                <span className="text-lg font-semibold tracking-tight text-slate-900">
                  CampusHub
                </span>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Welcome back
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Sign in to your account
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to access your college dashboard.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="you@college.edu"
                          autoComplete="email"
                          className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          className="cursor-pointer text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((visible) => !visible)}
                          className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-slate-400 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="size-5"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12s3.75 7.5 10.5 7.5c1.45 0 2.76-.3 3.91-.78M6.23 6.23C7.84 5.14 9.77 4.5 12 4.5c6.75 0 10.5 7.5 10.5 7.5a18.25 18.25 0 0 1-3.04 4.13M6.23 6.23 3 3m3.23 3.23 3.02 3.02m5.5 5.5L21 21"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.12 14.12A3 3 0 0 1 9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="size-5"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z"
                              />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.99]"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>

                {isSubmitted && (
                  <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
                    Form submitted successfully. API integration can be added
                    next.
                  </p>
                )}
              </form>
            </Form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Need help accessing your account?{" "}
              <a
                href="mailto:support@campushub.edu"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Contact support
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
