"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { SunIcon } from "@/components/ui/sun"
import { MoonIcon } from "@/components/ui/moon"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 px-0 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800">
        <span className="sr-only">Toggle theme</span>
        <div className="relative">
          <SunIcon className="scale-100 transition-all dark:scale-0" size={20} />
          <MoonIcon className="absolute top-0 scale-0 transition-all dark:scale-100" size={20} />
        </div>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 px-0 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative">
        <SunIcon className="scale-100 transition-all dark:scale-0" size={20} />
        <MoonIcon className="absolute top-0 scale-0 transition-all dark:scale-100" size={20} />
      </div>
    </Button>
  )
}

