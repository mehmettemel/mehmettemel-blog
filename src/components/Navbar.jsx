'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { AnimatedThemeToggle } from './ui/animated-theme-toggle'
import { AnimatedNavIcon } from './ui/animated-nav-icons'
import { Container } from './Container'

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <AnimatedNavIcon href="/incelemeler" label="Incelemeler" icon="decoded" />
      <AnimatedNavIcon href="/kesifler" label="Kesifler" icon="gems" />
      <AnimatedNavIcon href="/bu-hafta" label="Bu Hafta" icon="signals" />
      <AnimatedNavIcon href="/iletisim" label="Iletisim" icon="about" />
    </nav>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)

  const closeSheet = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="-m-2 rounded-lg p-2 text-muted transition hover:bg-secondary/50 hover:text-foreground md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="mt-8 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon
              href="/"
              label="Ana Sayfa"
              icon="home"
              onClick={closeSheet}
            />
            <span className="text-sm font-medium text-muted">Ana Sayfa</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon
              href="/incelemeler"
              label="Incelemeler"
              icon="decoded"
              onClick={closeSheet}
            />
            <span className="text-sm font-medium text-muted">Incelemeler</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon
              href="/kesifler"
              label="Kesifler"
              icon="gems"
              onClick={closeSheet}
            />
            <span className="text-sm font-medium text-muted">Kesifler</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon
              href="/bu-hafta"
              label="Bu Hafta"
              icon="signals"
              onClick={closeSheet}
            />
            <span className="text-sm font-medium text-muted">Bu Hafta</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <AnimatedNavIcon
              href="/iletisim"
              label="Iletisim"
              icon="about"
              onClick={closeSheet}
            />
            <span className="text-sm font-medium text-muted">Iletisim</span>
          </div>
          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-muted">Tema</span>
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
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="mx-auto flex max-w-7xl items-center justify-between py-3 md:justify-center">
          <div className="flex items-center gap-1">
            <AnimatedNavIcon href="/" label="Ana Sayfa" icon="home" />
            <DesktopNav />
            <div className="hidden md:block">
              <AnimatedThemeToggle />
            </div>
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
