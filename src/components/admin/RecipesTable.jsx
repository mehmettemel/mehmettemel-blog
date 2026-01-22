'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { RecipesForm } from './RecipesForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

export function RecipesTable() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [deletingRecipe, setDeletingRecipe] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Sorting
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    fetchRecipes()
  }, [search])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when search changes
  }, [search])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/recipes?${params}`)
      const data = await res.json()

      if (res.ok) {
        setRecipes(data.recipes || [])
      } else {
        console.error('Failed to fetch recipes:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingRecipe) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/recipes/${deletingRecipe.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setRecipes(recipes.filter((r) => r.id !== deletingRecipe.id))
        setDeletingRecipe(null)
      } else {
        const data = await res.json()
        console.error('Failed to delete recipe:', data.error)
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  // Apply sorting
  const sortedRecipes = [...recipes].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    // Handle null values
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    // Convert to lowercase for string comparison
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  // Apply pagination
  const totalPages = Math.ceil(sortedRecipes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRecipes = sortedRecipes.slice(startIndex, endIndex)

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DialogTrigger>
          <RecipesForm
            onSuccess={() => {
              setShowCreateDialog(false)
              fetchRecipes()
            }}
          />
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[60px] cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('id')}
              >
                ID <SortIcon column="id" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('name')}
              >
                Recipe Name <SortIcon column="name" />
              </TableHead>
              <TableHead className="w-[200px]">Ingredients Preview</TableHead>
              <TableHead
                className="w-[120px] cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('created_at')}
              >
                Date <SortIcon column="created_at" />
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedRecipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No recipes found
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-mono text-xs">
                    {recipe.id}
                  </TableCell>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="truncate max-w-[200px]">
                      {recipe.ingredients.split('\n')[0]}...
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(recipe.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingRecipe(recipe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingRecipe(recipe)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && sortedRecipes.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{' '}
            {Math.min(endIndex, sortedRecipes.length)} of {sortedRecipes.length}{' '}
            results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingRecipe && (
        <Dialog
          open={!!editingRecipe}
          onOpenChange={() => setEditingRecipe(null)}
        >
          <RecipesForm
            recipe={editingRecipe}
            onSuccess={() => {
              setEditingRecipe(null)
              fetchRecipes()
            }}
          />
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deletingRecipe}
        onOpenChange={() => setDeletingRecipe(null)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  )
}
