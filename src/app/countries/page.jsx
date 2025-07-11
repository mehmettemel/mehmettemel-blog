import Image from 'next/image'
import { Card } from '../../components/Card'
import { SimpleLayout } from '../../components/SimpleLayout'
import { countries } from '../../lib/countries'

export const metadata = {
  title: 'Countries',
  description: 'Countries I have visited and written about.',
}

function LinkIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
      />
    </svg>
  )
}

function CityIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="mr-2 inline-block h-5 w-5 text-teal-500"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.25c-4.556 0-8.25 3.694-8.25 8.25 0 5.25 8.25 11.25 8.25 11.25s8.25-6 8.25-11.25c0-4.556-3.694-8.25-8.25-8.25zm0 10.5a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z"
      />
    </svg>
  )
}

export default function CountriesPage() {
  return (
    <SimpleLayout
      title="Countries I've Visited"
      intro="Here are some of the countries I have visited. Click on a country to see related articles and experiences."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {countries.map((country) => (
          <Card as="li" key={country.slug}>
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image
                src={country.image}
                alt={country.name}
                width={32}
                height={32}
                unoptimized
              />
            </div>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={`/countries/${country.slug}`}>
                {country.name}
              </Card.Link>
            </h2>
            <ul className="mt-4 space-y-2">
              {country.cities.map((city) => (
                <li
                  key={city}
                  className="flex items-center text-sm text-zinc-600 dark:text-zinc-300"
                >
                  <CityIcon />
                  <span>{city}</span>
                </li>
              ))}
            </ul>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">Go to {country.name}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
