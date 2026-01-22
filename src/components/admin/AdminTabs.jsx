'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotesTable } from './NotesTable'
import { ListItemsTable } from './ListItemsTable'
import { RecipesTable } from './RecipesTable'

export function AdminTabs() {
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="lists">Lists</TabsTrigger>
        <TabsTrigger value="recipes">Recipes</TabsTrigger>
      </TabsList>

      <TabsContent value="notes" className="mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Notes Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage links, quotes, videos, and book notes
            </p>
          </div>
          <NotesTable />
        </div>
      </TabsContent>

      <TabsContent value="lists" className="mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Lists Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage books, movies, and products
            </p>
          </div>
          <ListItemsTable />
        </div>
      </TabsContent>

      <TabsContent value="recipes" className="mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Recipes Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage your recipe collection
            </p>
          </div>
          <RecipesTable />
        </div>
      </TabsContent>
    </Tabs>
  )
}
