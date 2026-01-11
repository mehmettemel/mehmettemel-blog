import Link from 'next/link'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/95">
      <Container>
        <div className="max-w-[620px] mx-auto py-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div>
              <h3 className="font-bold text-foreground mb-1">Mehmet Temel</h3>
              <p className="text-sm text-muted-foreground">
                Gıda Mühendisi × Frontend Developer
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/temelbusiness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/mehmettemelim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
              <Link
                href="https://github.com/mehmettemel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </Link>
              <Link
                href="/feed.xml"
                className="text-muted hover:text-primary transition"
                aria-label="RSS Feed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Her Pazartesi yeni Signals yayınlanır.</p>
              <p>© {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
