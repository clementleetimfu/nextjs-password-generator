"use client"

import { useState, useEffect } from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "justify-center items-center text-center max-w-[80vw] sm:max-w-md",
        },
        style: {
          background: 'var(--muted)',
          color: 'var(--foreground)',
          border: 'var(--border)',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
