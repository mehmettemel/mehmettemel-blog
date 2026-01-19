'use client'

import { useState, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { TravelPlaceItem } from './TravelPlaceItem'

/**
 * TravelAccordion Component
 * Hierarchical display of travel data: Continents → Countries → Places
 * Uses nested Accordion components for collapsible structure
 */
export function TravelAccordion({ data }) {
  // State for tracking places (for optimistic updates)
  const [places, setPlaces] = useState(() => {
    // Flatten all places from hierarchy for easier state management
    const allPlaces = {}
    data.forEach((continent) => {
      continent.countries.forEach((country) => {
        country.places.forEach((place) => {
          allPlaces[place.id] = place
        })
      })
    })
    return allPlaces
  })

  // Handle place update (optimistic update)
  const handlePlaceUpdate = (updatedPlace) => {
    setPlaces((prev) => ({
      ...prev,
      [updatedPlace.id]: updatedPlace,
    }))
  }

  // Calculate stats for continents and countries
  const stats = useMemo(() => {
    const continentStats = {}
    const countryStats = {}

    data.forEach((continent) => {
      continentStats[continent.id] = {
        total: 0,
        visited: 0,
        liked: 0,
      }

      continent.countries.forEach((country) => {
        countryStats[country.id] = {
          total: 0,
          visited: 0,
          liked: 0,
        }

        country.places.forEach((place) => {
          const currentPlace = places[place.id]
          continentStats[continent.id].total++
          countryStats[country.id].total++

          if (currentPlace?.is_visited) {
            continentStats[continent.id].visited++
            countryStats[country.id].visited++
          }

          if (currentPlace?.is_liked) {
            continentStats[continent.id].liked++
            countryStats[country.id].liked++
          }
        })
      })
    })

    return { continentStats, countryStats }
  }, [data, places])

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center dark:border-border/40 dark:bg-muted/20">
        <p className="text-sm text-muted-foreground sm:text-base">
          Henüz seyahat yeri eklenmemiş. Telegram&apos;dan <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/t</code> komutu ile yer ekleyebilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Continent Level Accordion */}
      <Accordion type="multiple" className="space-y-3">
        {data.map((continent) => {
          const continentStat = stats.continentStats[continent.id]

          return (
            <AccordionItem
              key={continent.id}
              value={`continent-${continent.id}`}
              className="rounded-lg border border-border/60 bg-card dark:border-border/40"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 dark:hover:bg-accent/30 sm:px-5 sm:py-4">
                <div className="flex w-full items-center justify-between pr-2">
                  <div className="flex items-center gap-2 text-left sm:gap-3">
                    <span className="text-2xl sm:text-3xl">
                      {continent.emoji}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {continent.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {continent.countries.length} ülke
                      </p>
                    </div>
                  </div>
                  {/* Continent Stats Badge */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
                    <span>
                      {continentStat.visited}/{continentStat.total} ziyaret
                    </span>
                    {continentStat.liked > 0 && (
                      <span className="text-red-500 dark:text-red-400">
                        ❤️ {continentStat.liked}
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 pt-2 sm:px-5">
                {/* Country Level Accordion (nested) */}
                <Accordion type="multiple" className="space-y-2">
                  {continent.countries.map((country) => {
                    const countryStat = stats.countryStats[country.id]

                    return (
                      <AccordionItem
                        key={country.id}
                        value={`country-${country.id}`}
                        className="rounded-md border border-border/40 bg-muted/10 dark:border-border/30 dark:bg-muted/5"
                      >
                        <AccordionTrigger className="px-3 py-2.5 hover:no-underline hover:bg-accent/40 dark:hover:bg-accent/20 sm:px-4 sm:py-3">
                          <div className="flex w-full items-center justify-between pr-2">
                            <div className="flex items-center gap-2 text-left">
                              <span className="text-lg sm:text-xl">
                                {country.emoji}
                              </span>
                              <div>
                                <h4 className="text-sm font-medium text-foreground sm:text-base">
                                  {country.name}
                                </h4>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {country.places.length} yer
                                </p>
                              </div>
                            </div>
                            {/* Country Stats Badge */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-2.5">
                              <span>
                                {countryStat.visited}/{countryStat.total}
                              </span>
                              {countryStat.liked > 0 && (
                                <span className="text-red-500 dark:text-red-400">
                                  ❤️ {countryStat.liked}
                                </span>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-3 pb-3 pt-2 sm:px-4">
                          {/* Places List */}
                          {country.places.length > 0 ? (
                            <div className="space-y-2">
                              {country.places.map((place) => (
                                <TravelPlaceItem
                                  key={place.id}
                                  place={places[place.id]}
                                  onUpdate={handlePlaceUpdate}
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="py-3 text-center text-xs text-muted-foreground sm:text-sm">
                              Bu ülkede henüz yer yok
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
