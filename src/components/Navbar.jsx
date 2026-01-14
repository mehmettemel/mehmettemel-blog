'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { AnimatedThemeToggle } from './ui/animated-theme-toggle'
import { Container } from './Container'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'

const kesiflerItems = [
  { href: '/kesifler?tab=links', label: 'Linkler', emoji: '📚' },
  { href: '/kesifler?tab=quotes', label: 'Alıntılar', emoji: '💭' },
  { href: '/kesifler?tab=video', label: 'Video', emoji: '🎬' },
  { href: '/kesifler?tab=books', label: 'Kitap', emoji: '📖' },
]

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  )
}

function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink href="/incelemeler">İncelemeler</NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Keşifler</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-1 p-2">
              {kesiflerItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavLink href="/bu-hafta">Bu Hafta</NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavLink href="/iletisim">İletişim</NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)

  const closeSheet = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="-m-2 rounded-lg p-2 text-muted-foreground transition hover:text-foreground md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-56">
        <nav className="mt-8 flex flex-col gap-1">
          <Link
            href="/"
            onClick={closeSheet}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/incelemeler"
            onClick={closeSheet}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            İncelemeler
          </Link>

          {/* Keşifler Section */}
          <div className="mt-2 mb-1 px-3 text-xs font-semibold text-muted-foreground/60">
            Keşifler
          </div>
          {kesiflerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSheet}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <Link
            href="/bu-hafta"
            onClick={closeSheet}
            className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            Bu Hafta
          </Link>
          <Link
            href="/iletisim"
            onClick={closeSheet}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            İletişim
          </Link>
          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-muted-foreground">
                Tema
              </span>
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
    <header className="sticky top-0 z-50">
      <Container>
        <div className="mx-auto flex max-w-7xl items-center justify-between py-3 md:justify-center">
          <div className="flex items-center">
            <NavLink href="/">Ana Sayfa</NavLink>
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
