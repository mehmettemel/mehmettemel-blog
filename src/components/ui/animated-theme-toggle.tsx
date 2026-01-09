"use client"

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const AnimatedThemeToggle = ({className}:{className?:string}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn("p-2 rounded-lg", className)}
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "text-muted hover:text-foreground hover:bg-secondary/50",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <SolarSwitch isDark={isDark} />
    </button>
  );
};

const SolarSwitch = ({ isDark }: { isDark: boolean }) => {
  const duration = 0.7;

  return (
    <motion.div animate={isDark ? "dark" : "light"}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sun rays */}
        <motion.g
          variants={{
            light: { opacity: 1, scale: 1, rotate: 0 },
            dark: { opacity: 0, scale: 0.5, rotate: 45 }
          }}
          transition={{ duration }}
        >
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
        {/* Sun circle */}
        <motion.circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          variants={{
            light: { opacity: 1, scale: 1 },
            dark: { opacity: 0, scale: 0.5 }
          }}
          transition={{ duration }}
        />
        {/* Moon crescent */}
        <motion.path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          fill="currentColor"
          fillOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            light: { opacity: 0, scale: 0.5, rotate: -30 },
            dark: { opacity: 1, scale: 1, rotate: 0 }
          }}
          transition={{ duration }}
        />
      </svg>
    </motion.div>
  );
};
