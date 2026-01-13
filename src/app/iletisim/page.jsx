import Link from 'next/link'
import { Container } from '../../components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '../../components/SocialIcons'

export const metadata = {
  title: 'Iletisim | Mehmet Temel',
  description:
    'Iletisim bilgilerim ve sosyal medya hesaplarim. Benimle iletisime gecin.',
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function SocialLink({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 sm:gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:bg-secondary/30 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-secondary/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110">
        <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 fill-muted-foreground transition-colors duration-300 group-hover:fill-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-medium text-foreground">{children}</p>
      </div>
      <svg
        className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  )
}

export default function Contact() {
  return (
    <Container>
      <div className="mx-auto max-w-7xl py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1.5">
          İletişim
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-6">
          Benimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.
        </p>

        {/* Email */}
        <div className="mb-5">
          <Link
            href="mailto:contact@mehmettemel.com"
            className="group flex items-center gap-2.5 sm:gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:bg-secondary/30 hover:shadow-md active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-secondary/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110">
              <MailIcon className="h-5 w-5 sm:h-5.5 sm:w-5.5 fill-muted-foreground transition-colors duration-300 group-hover:fill-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5">Email</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                contact@mehmettemel.com
              </p>
            </div>
            <svg
              className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Social Links */}
        <div className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">
            Sosyal Medya
          </h2>
          <SocialLink href="https://x.com/temelbusiness" icon={XIcon}>
            Twitter / X
          </SocialLink>
          <SocialLink
            href="https://www.instagram.com/mehmettemelim"
            icon={InstagramIcon}
          >
            Instagram
          </SocialLink>
          <SocialLink
            href="https://github.com/mehmettemel"
            icon={GitHubIcon}
          >
            GitHub
          </SocialLink>
          <SocialLink
            href="https://www.linkedin.com/in/mehmettemelim"
            icon={LinkedInIcon}
          >
            LinkedIn
          </SocialLink>
        </div>
      </div>
    </Container>
  )
}
