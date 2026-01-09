import Link from 'next/link'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="mt-auto">
      <Container>
        <div className="max-w-[620px] mx-auto py-12">
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted border-t border-border pt-8">
            <div className="flex items-center gap-1">
              <span>Theme</span>
              <span className="text-foreground">→</span>
            </div>
            <Link
              href="https://github.com/mehmettemel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              Code on Github
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
