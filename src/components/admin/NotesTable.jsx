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
import { Edit, Trash2, Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { NotesForm } from './NotesForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

const NOTE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'link', label: 'Links' },
  { value: 'quote', label: 'Quotes' },
  { value: 'video', label: 'Videos' },
  { value: 'book', label: 'Books' },
]

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'gida', label: 'Gıda' },
  { value: 'saglik', label: 'Sağlık' },
  { value: 'kisisel', label: 'Kişisel' },
  { value: 'genel', label: 'Genel' },
]

export function NotesTable() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('quote')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingNote, setEditingNote] = useState(null)
  const [deletingNote, setDeletingNote] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Sorting
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    fetchNotes()
  }, [typeFilter, categoryFilter, search])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [typeFilter, categoryFilter, search])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter !== 'all') params.set('type', typeFilter)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/notes?${params}`)
      const data = await res.json()

      if (res.ok) {
        setNotes(data.notes || [])
      } else {
        console.error('Failed to fetch notes:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingNote) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/notes/${deletingNote.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== deletingNote.id))
        setDeletingNote(null)
      } else {
        const data = await res.json()
        console.error('Failed to delete note:', data.error)
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
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
  const sortedNotes = [...notes].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNotes = sortedNotes.slice(startIndex, endIndex)

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
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {typeFilter !== 'link' && typeFilter !== 'all' && (
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DialogTrigger>
          <NotesForm
            onSuccess={() => {
              setShowCreateDialog(false)
              fetchNotes()
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
                className="w-[100px] cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('note_type')}
              >
                Type <SortIcon column="note_type" />
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon column="category" />
              </TableHead>
              <TableHead>Content</TableHead>
              <TableHead
                className="w-[150px] cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort('source')}
              >
                Source <SortIcon column="source" />
              </TableHead>
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
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedNotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No notes found
                </TableCell>
              </TableRow>
            ) : (
              paginatedNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-mono text-xs">
                    {note.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{note.note_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {note.category ? (
                      <Badge variant="secondary">{note.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">
                      {note.title && (
                        <span className="font-medium">{note.title}: </span>
                      )}
                      <span className="text-muted-foreground">
                        {note.text}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {note.source || note.author || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(note.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingNote(note)}
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
      {!loading && sortedNotes.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedNotes.length)}{' '}
            of {sortedNotes.length} results
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
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <NotesForm
            note={editingNote}
            onSuccess={() => {
              setEditingNote(null)
              fetchNotes()
            }}
          />
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deletingNote}
        onOpenChange={() => setDeletingNote(null)}
        onConfirm={handleDelete}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  )
}
