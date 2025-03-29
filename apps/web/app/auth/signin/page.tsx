"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { signInUser } from "@/server/users";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: SignInFormData) => {
    setServerError(null);
    setIsLoading(true);
    
    try {
      const { data: responseData, error } = await signInUser(
        data.email,
        data.password,
        true,
        "/dashboard"
      );
      
      if (error) {
        setServerError("Invalid email or password. Please try again.");
        console.error("Signin error:", error);
      } else {
        console.log("Signin successful:", responseData);
      }
    } catch (err) {
      console.error("Signin error:", err);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left Section with Image */}
        <div className="hidden md:flex items-center justify-center bg-muted">
          <div className="relative w-full h-full">
            <Image
              src="/image.jpg"
              alt="Welcome illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Section with Form */}
        <div className="flex flex-col justify-center px-8 md:px-12 py-12 bg-background">
          <div className="max-w-md mx-auto w-full space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">Login to your account</p>
            </div>

            {/* Form */}
            <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium pb-2 text-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center pb-2">
                    <label 
                      htmlFor="password" 
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    placeholder="Enter your password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Display server error message if any */}
              {serverError && (
                <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                  {serverError}
                </div>
              )}

              <div>
                <Button 
                  type="submit" 
                  className="w-full py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full py-3 flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 326667 333333"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className="w-5 h-5"
                >
                  <path
                    d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z"
                    fill="#4285f4"
                  />
                  <path
                    d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z"
                    fill="#34a853"
                  />
                  <path
                    d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z"
                    fill="#fbbc04"
                  />
                  <path
                    d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z"
                    fill="#ea4335"
                  />
                </svg>
                <span className="text-foreground">Sign in with Google</span>
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
