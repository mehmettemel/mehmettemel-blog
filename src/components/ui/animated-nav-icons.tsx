"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AnimatedNavIconProps {
  href: string
  label: string
  icon: "home" | "blog" | "decoded" | "contact" | "gems" | "signals" | "about"
  onClick?: () => void
}

export function AnimatedNavIcon({ href, label, icon, onClick }: AnimatedNavIconProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (icon !== "home" && pathname.startsWith(href + "/"))

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "p-2 rounded-lg transition-colors",
        isActive 
          ? "text-primary" 
          : "text-muted hover:text-foreground hover:bg-secondary/50"
      )}
    >
      {icon === "home" && <HomeIcon isActive={isActive} />}
      {icon === "blog" && <BlogIcon isActive={isActive} />}
      {icon === "decoded" && <BlogIcon isActive={isActive} />}
      {icon === "contact" && <ContactIcon isActive={isActive} />}
      {icon === "about" && <AboutIcon isActive={isActive} />}
      {icon === "gems" && <GemsIcon isActive={isActive} />}
      {icon === "signals" && <SignalsIcon isActive={isActive} />}
    </Link>
  )
}

function HomeIcon({ isActive }: { isActive: boolean }) {
  const duration = 0.7

  return (
    <motion.div animate={isActive ? "active" : "inactive"}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House outline - always visible */}
        <motion.path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            active: { opacity: 0, scale: 0.9 },
            inactive: { opacity: 1, scale: 1 }
          }}
          transition={{ duration }}
        />
        {/* House filled - appears when active */}
        <motion.path
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            active: { opacity: 1, scale: 1 },
            inactive: { opacity: 0, scale: 0.9 }
          }}
          transition={{ duration }}
        />
      </svg>
    </motion.div>
  )
}

function BlogIcon({ isActive }: { isActive: boolean }) {
  const duration = 0.7

  return (
    <motion.div animate={isActive ? "active" : "inactive"}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Book outline - inactive */}
        <motion.path
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            active: { opacity: 0, scale: 0.8 },
            inactive: { opacity: 1, scale: 1 }
          }}
          transition={{ duration }}
        />
        {/* Book with pages - active */}
        <motion.g
          variants={{
            active: { opacity: 1, scale: 1 },
            inactive: { opacity: 0, scale: 0.8 }
          }}
          transition={{ duration }}
        >
          <motion.path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="currentColor"
            fill="currentColor"
            fillOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M9 6h8M9 10h8M9 14h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

function ContactIcon({ isActive }: { isActive: boolean }) {
  const duration = 0.7

  return (
    <motion.div animate={isActive ? "active" : "inactive"}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Closed envelope - inactive */}
        <motion.g
          variants={{
            active: { opacity: 0, scale: 0.8, y: 2 },
            inactive: { opacity: 1, scale: 1, y: 0 }
          }}
          transition={{ duration }}
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m3 7 9 6 9-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
        {/* Open envelope - active */}
        <motion.g
          variants={{
            active: { opacity: 1, scale: 1, y: 0 },
            inactive: { opacity: 0, scale: 0.8, y: -2 }
          }}
          transition={{ duration }}
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            fill="currentColor"
            fillOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m3 7 9 6 9-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.rect
            x="7"
            y="9"
            width="10"
            height="6"
            fill="currentColor"
            fillOpacity="0.3"
            rx="1"
            animate={{
              scale: [0.8, 1, 0.9],
              opacity: [0.5, 0.8, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

function GemsIcon({ isActive }: { isActive: boolean }) {
  const duration = 0.7

  return (
    <motion.div animate={isActive ? "active" : "inactive"}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Diamond outline - inactive */}
        <motion.path
          d="M6 3h12l4 6-10 12L2 9l4-6z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            active: { opacity: 0, scale: 0.8 },
            inactive: { opacity: 1, scale: 1 }
          }}
          transition={{ duration }}
        />
        {/* Diamond filled - active */}
        <motion.g
          variants={{
            active: { opacity: 1, scale: 1 },
            inactive: { opacity: 0, scale: 0.8 }
          }}
          transition={{ duration }}
        >
          <motion.path
            d="M6 3h12l4 6-10 12L2 9l4-6z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M12 3l0 18M2 9h20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

function SignalsIcon({ isActive }: { isActive: boolean }) {
  const duration = 0.7

  return (
    <motion.div animate={isActive ? "active" : "inactive"}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Signal waves outline - inactive */}
        <motion.g
          variants={{
            active: { opacity: 0, scale: 0.8 },
            inactive: { opacity: 1, scale: 1 }
          }}
          transition={{ duration }}
        >
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8.5 8.5a5 5 0 0 1 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5.5 5.5a9 9 0 0 1 13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        {/* Signal waves filled - active */}
        <motion.g
          variants={{
            active: { opacity: 1, scale: 1 },
            inactive: { opacity: 0, scale: 0.8 }
          }}
          transition={{ duration }}
        >
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="currentColor" strokeWidth="2" />
          <motion.path
            d="M8.5 8.5a5 5 0 0 1 7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              opacity: [0.5, 1, 0.5],
              pathLength: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M5.5 5.5a9 9 0 0 1 13 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              pathLength: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}

function AboutIcon({ isActive }: { isActive: boolean }) {
  const duration = 0.7

  return (
    <motion.div animate={isActive ? "active" : "inactive"}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* User outline - inactive */}
        <motion.g
          variants={{
            active: { opacity: 0, scale: 0.8 },
            inactive: { opacity: 1, scale: 1 }
          }}
          transition={{ duration }}
        >
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        {/* User filled - active */}
        <motion.g
          variants={{
            active: { opacity: 1, scale: 1 },
            inactive: { opacity: 0, scale: 0.8 }
          }}
          transition={{ duration }}
        >
          <circle cx="12" cy="8" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}
