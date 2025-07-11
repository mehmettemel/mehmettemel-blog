import vietnamFlag from '../images/flags/vietnam.svg'
import cambodiaFlag from '../images/flags/cambodia.svg'
import thailandFlag from '../images/flags/thailand.svg'
import kazakhstanFlag from '../images/flags/kazakhstan.svg'

export const countries = [
  {
    slug: 'vietnam',
    name: 'Vietnam',
    image: vietnamFlag,
    cities: [
      'Hanoi',
      'Ho Chi Minh City',
      'Da Nang',
      'Hue',
      'Hoi An',
      'Nha Trang',
    ],
  },
  {
    slug: 'cambodia',
    name: 'Cambodia',
    image: cambodiaFlag,
    cities: ['Siem Reap', 'Battambang'],
  },
  {
    slug: 'thailand',
    name: 'Thailand',
    image: thailandFlag,
    cities: ['Bangkok', 'Chiang Mai'],
  },
  {
    slug: 'kazakhstan',
    name: 'Kazakhstan',
    image: kazakhstanFlag,
    cities: ['Almaty'],
  },
]
