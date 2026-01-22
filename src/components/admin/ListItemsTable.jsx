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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, Check, Heart } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ListItemsForm } from './ListItemsForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

const LIST_TYPES = [
  { value: 'kitap', label: 'Kitap' },
  { value: 'film', label: 'Film & Dizi' },
  { value: 'urun', label: 'Ürün' },
]

export function ListItemsTable() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('kitap')
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Sorting
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    fetchItems()
  }, [typeFilter, search])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [typeFilter, search])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('list_type', typeFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/list-items?${params}`)
      const data = await res.json()

      if (res.ok) {
        setItems(data.items || [])
      } else {
        console.error('Failed to fetch items:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/list-items/${deletingItem.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setItems(items.filter((i) => i.id !== deletingItem.id))
        setDeletingItem(null)
      } else {
        const data = await res.json()
        console.error('Failed to delete item:', data.error)
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
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
  const sortedItems = [...items].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = sortedItems.slice(startIndex, endIndex)

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
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIST_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DialogTrigger>
          <ListItemsForm
            onSuccess={() => {
              setShowCreateDialog(false)
              fetchItems()
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
                Name <SortIcon column="name" />
              </TableHead>
              <TableHead
                className="w-[200px] cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('author')}
              >
                Author/Director <SortIcon column="author" />
              </TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
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
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">
                    {item.id}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.author || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {item.is_completed && (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          Done
                        </Badge>
                      )}
                      {item.is_liked && (
                        <Badge variant="secondary" className="gap-1">
                          <Heart className="h-3 w-3" />
                          Liked
                        </Badge>
                      )}
                      {!item.is_completed && !item.is_liked && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingItem(item)}
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
      {!loading && sortedItems.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedItems.length)}{' '}
            of {sortedItems.length} results
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog
          open={!!editingItem}
          onOpenChange={() => setEditingItem(null)}
        >
          <ListItemsForm
            item={editingItem}
            onSuccess={() => {
              setEditingItem(null)
              fetchItems()
            }}
          />
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title="Delete List Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  )
}
