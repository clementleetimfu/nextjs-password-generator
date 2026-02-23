"use client"

import { useState, useEffect } from "react"
import { Toaster as Sonner } from "sonner"
import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ className, ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Detect theme from document classList (managed by custom useTheme hook)
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    }

    // Initial check
    updateTheme()

    // Listen for class changes
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      position="top-center"
      invert={false}
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg justify-center items-center text-center max-w-[85vw] sm:max-w-md",
          title: "text-center w-full",
          description: "group-[.toast]:text-muted-foreground text-center w-full",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
