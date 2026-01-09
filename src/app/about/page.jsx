import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '../../components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '../../components/SocialIcons'
import avatarImage from '../../images/avatar2.jpg'

export const metadata = {
  title: 'About - Mehmet Temel | Travel & Food Blogger',
  description:
    'Learn more about Mehmet Temel, a passionate traveler and food enthusiast sharing authentic experiences from around the world.',
}

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-foreground transition hover:text-primary"
      >
        <Icon className="h-6 w-6 flex-none fill-muted transition group-hover:fill-primary" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
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

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={avatarImage}
              alt="Mehmet Temel"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-secondary object-cover"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Xin chào! I'm Mehmet Temel.
          </h1>
          <div className="mt-6 space-y-7 text-base text-muted-foreground">
            <p>
              I'm a passionate traveler and food enthusiast who believes that the best way
              to understand a culture is through its cuisine. Based in Adana, Turkey, but
              always on the move, I've spent years exploring hidden food gems and authentic
              local experiences around the world.
            </p>
            <p>
              What started as a personal journey to document my favorite food spots has
              grown into a platform where I share honest restaurant reviews, travel tips,
              and stories from my adventures. From street food stalls to fine dining
              restaurants, I'm always searching for that next unforgettable meal.
            </p>
            <p>
              My approach is simple: eat like a local, travel with an open mind, and share
              genuine experiences. No pretense, no filters—just real stories about real
              food and the amazing people I meet along the way.
            </p>
            <p>
              When I'm not traveling or eating my way through a new city, I work as a
              Senior Frontend Developer, building digital experiences that connect people.
              This unique combination of technical expertise and creative storytelling
              helps me bring my adventures to life on this blog.
            </p>
            <p>
              Join me on this culinary journey as we discover authentic flavors, hidden
              gems, and unforgettable experiences from around the globe.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://x.com/temelbusiness" icon={XIcon}>
              Follow on X
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/mehmettemelim"
              icon={InstagramIcon}
              className="mt-4"
            >
              Follow on Instagram
            </SocialLink>
            <SocialLink
              href="https://github.com/mehmettemel"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/mehmettemelim"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:contact@mehmettemel.com"
              icon={MailIcon}
              className="mt-8 border-t border-border pt-8"
            >
              contact@mehmettemel.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
