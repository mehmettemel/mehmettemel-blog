import Link from 'next/link'
import { Container } from '../components/Container'

export default function NotFound() {
  return (
    <Container>
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-[22px] font-bold text-foreground">404 - Page not found</h1>
          <p className="text-[15px] text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go back home
          </Link>
        </div>
      </div>
    </Container>
  )
}
