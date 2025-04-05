"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Space_Mono } from 'next/font/google';

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin']
})

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation handlers
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-slate-200/20 dark:border-zinc-800/20 bg-gradient-to-b from-white/40 to-white/20 dark:from-zinc-950/40 dark:to-zinc-950/10 backdrop-blur-md supports-[backdrop-filter]:from-white/30 supports-[backdrop-filter]:to-white/10 dark:supports-[backdrop-filter]:from-zinc-950/30 dark:supports-[backdrop-filter]:to-zinc-950/5">
      <div className="container mx-auto flex justify-between items-center h-18 px-4 sm:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <span className={`text-xl font-bold ${spaceMono.className} bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 group-hover:from-rose-400 group-hover:to-orange-400 transition-all duration-1000`}>
              Benkyoshi
            </span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center space-x-10">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300 hover:underline decoration-rose-500 decoration-2 underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/resources"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300 hover:underline decoration-rose-500 decoration-2 underline-offset-4"
          >
            Resources
          </Link>
          <Link
            href="#docs"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300 hover:underline decoration-rose-500 decoration-2 underline-offset-4"
          >
            About Us
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex">
            <ThemeToggle />
          </div>

          {session ? (
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
              onClick={() => handleNavigation("/dashboard/home")}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300"
                onClick={() => handleNavigation("/auth/signup")}
              >
                Sign up
              </Button>
              <Button
                variant="outline"
                className="hidden sm:inline-flex border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
                onClick={() => handleNavigation("/auth/signin")}
              >
                Login
              </Button>
            </>
          )}

          <button
            className="md:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-b border-slate-200/20 dark:border-zinc-800/20 bg-gradient-to-b from-white/40 to-white/20 dark:from-zinc-950/40 dark:to-zinc-950/10 backdrop-blur-md supports-[backdrop-filter]:from-white/30 supports-[backdrop-filter]:to-white/10 dark:supports-[backdrop-filter]:from-zinc-950/30 dark:supports-[backdrop-filter]:to-zinc-950/5"
          >
            <div className="container mx-auto py-4 px-4 flex flex-col space-y-3">
              <Link
                href="#features"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-2 px-4 rounded-md hover:bg-slate-100/70 dark:hover:bg-zinc-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/resources"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-2 px-4 rounded-md hover:bg-slate-100/70 dark:hover:bg-zinc-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="#docs"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-2 px-4 rounded-md hover:bg-slate-100/70 dark:hover:bg-zinc-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <div className="pt-2 border-t border-slate-200/20 dark:border-zinc-800/20 flex items-center justify-between">
                <ThemeToggle />
                {session ? (
                  <Button
                    variant="outline"
                    className="border-slate-300/70 dark:border-zinc-700/70 bg-slate-50/30 dark:bg-zinc-900/30 text-zinc-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavigation("/dashboard");
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300 hover:bg-slate-100/50 dark:hover:bg-zinc-800/30"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavigation("/auth/signup");
                      }}
                    >
                      Sign up
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-300/70 dark:border-zinc-700/70 bg-slate-50/30 dark:bg-zinc-900/30 text-zinc-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-zinc-800/50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavigation("/auth/signin");
                      }}
                    >
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
