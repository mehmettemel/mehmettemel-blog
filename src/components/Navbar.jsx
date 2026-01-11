'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet'
import { AnimatedThemeToggle } from './ui/animated-theme-toggle'
import { AnimatedNavIcon } from './ui/animated-nav-icons'
import { Container } from './Container'

function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-1">
      <AnimatedNavIcon href="/decoded" label="Decoded" icon="decoded" />
      <AnimatedNavIcon href="/gems" label="Gems" icon="gems" />
      <AnimatedNavIcon href="/signals" label="Signals" icon="signals" />
      <AnimatedNavIcon href="/about" label="Hakkımda" icon="about" />
    </nav>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)

  const closeSheet = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden p-2 -m-2 text-muted hover:text-foreground rounded-lg hover:bg-secondary/50 transition">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="flex flex-col gap-1 mt-8">
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon href="/" label="Home" icon="home" onClick={closeSheet} />
            <span className="text-sm font-medium text-muted">Home</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon href="/decoded" label="Decoded" icon="decoded" onClick={closeSheet} />
            <span className="text-sm font-medium text-muted">Decoded</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon href="/gems" label="Gems" icon="gems" onClick={closeSheet} />
            <span className="text-sm font-medium text-muted">Gems</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon href="/signals" label="Signals" icon="signals" onClick={closeSheet} />
            <span className="text-sm font-medium text-muted">Signals</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon href="/about" label="Hakkımda" icon="about" onClick={closeSheet} />
            <span className="text-sm font-medium text-muted">Hakkımda</span>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-muted">Theme</span>
              <AnimatedThemeToggle />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40">
      <Container>
        <div className="max-w-[620px] mx-auto flex items-center justify-between py-3">
          <AnimatedNavIcon href="/" label="Home" icon="home" />
          <div className="flex items-center gap-1">
            <DesktopNav />
            <div className="hidden md:block">
              <AnimatedThemeToggle />
            </div>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  )
}
