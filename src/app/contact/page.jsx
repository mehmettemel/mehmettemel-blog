import { Container } from '../../components/Container'
import Link from 'next/link'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Mehmet Temel',
}

export default function Contact() {
  return (
    <Container>
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
        <h1 className="text-[22px] font-bold text-foreground mb-6">Contact</h1>
        
        <div className="space-y-6 text-base">
          <p className="text-muted-foreground">
            Feel free to reach out via email or connect with me on social media.
          </p>

          <div className="space-y-3">
            <div>
              <span className="text-muted">Email:</span>{' '}
              <a
                href="mailto:mehmet@mehmettemel.com"
                className="text-foreground hover:text-primary transition"
              >
                mehmet@mehmettemel.com
              </a>
            </div>

            <div>
              <span className="text-muted">Twitter:</span>{' '}
              <Link
                href="https://x.com/temelbusiness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                @temelbusiness
              </Link>
            </div>

            <div>
              <span className="text-muted">Instagram:</span>{' '}
              <Link
                href="https://www.instagram.com/mehmettemelim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                @mehmettemelim
              </Link>
            </div>

            <div>
              <span className="text-muted">GitHub:</span>{' '}
              <Link
                href="https://github.com/mehmettemel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                mehmettemel
              </Link>
            </div>

            <div>
              <span className="text-muted">LinkedIn:</span>{' '}
              <Link
                href="https://www.linkedin.com/in/mehmettemelim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                mehmettemelim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
