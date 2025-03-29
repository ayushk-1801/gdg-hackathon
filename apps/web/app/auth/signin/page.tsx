import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function SignIn() {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left Section with Image */}
        <div className="hidden md:flex items-center justify-center bg-gray-50">
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
        <div className="flex flex-col justify-center px-8 md:px-12 py-12 bg-white">
          <div className="max-w-md mx-auto w-full space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-gray-600">Login to your account</p>
            </div>
            
            {/* Form */}
            <form className="space-y-6 mt-8">
              <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                </label>
                <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
                </label>
                <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              </div>
              
                <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
                </div>

                
              
              <div>
                <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white">
                  Sign In
                </Button>
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full py-3 border border-gray-300 shadow-sm hover:bg-gray-50 flex items-center justify-center space-x-2">
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
                <span className="text-black">Sign in with Google</span>
              </Button>
            </form>
            
            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
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
