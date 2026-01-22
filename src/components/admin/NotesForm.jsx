'use client'

import { useState, useEffect } from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NOTE_TYPES = [
  { value: 'link', label: 'Link' },
  { value: 'quote', label: 'Quote' },
  { value: 'video', label: 'Video' },
  { value: 'book', label: 'Book' },
]

const CATEGORIES = [
  { value: 'gida', label: 'Gıda' },
  { value: 'saglik', label: 'Sağlık' },
  { value: 'kisisel', label: 'Kişisel' },
  { value: 'genel', label: 'Genel' },
]

export function NotesForm({ note, onSuccess }) {
  const isEdit = !!note
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    type: note?.note_type || 'quote',
    title: note?.title || '',
    text: note?.text || '',
    author: note?.author || '',
    source: note?.source || '',
    url: note?.url || '',
    category: note?.category || 'genel',
    tags: note?.tags ? note.tags.join(', ') : '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        type: formData.type,
        title: formData.title || null,
        text: formData.text,
        author: formData.author || null,
        source: formData.source || null,
        url: formData.url || null,
        category: formData.type === 'link' ? null : formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      }

      const url = isEdit
        ? `/api/admin/notes/${note.id}`
        : '/api/admin/notes'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save note')
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving note:', err)
      setError(err.message || 'Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  const showCategory = formData.type !== 'link'
  const showUrl = formData.type === 'link' || formData.type === 'video'
  const showSource = formData.type === 'video' || formData.type === 'book'
  const showAuthor = formData.type !== 'link'

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? 'Edit Note' : 'Create Note'}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'Update the note details below.'
            : 'Fill in the details to create a new note.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Note Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value })
            }
            disabled={isEdit || loading}
          >
            <SelectTrigger>
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
        </div>

        {/* Title (for links) */}
        {formData.type === 'link' && (
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={loading}
              placeholder="Link title"
            />
          </div>
        )}

        {/* Text */}
        <div className="space-y-2">
          <Label htmlFor="text">
            {formData.type === 'link' ? 'Description' : 'Text'} *
          </Label>
          <Textarea
            id="text"
            value={formData.text}
            onChange={(e) =>
              setFormData({ ...formData, text: e.target.value })
            }
            disabled={loading}
            placeholder={
              formData.type === 'link'
                ? 'Link description'
                : 'Note text or quote'
            }
            rows={4}
          />
        </div>

        {/* URL */}
        {showUrl && (
          <div className="space-y-2">
            <Label htmlFor="url">
              URL {formData.type === 'link' ? '*' : ''}
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              disabled={loading}
              placeholder="https://..."
            />
          </div>
        )}

        {/* Author */}
        {showAuthor && (
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              disabled={loading}
              placeholder="Author name"
            />
          </div>
        )}

        {/* Source */}
        {showSource && (
          <div className="space-y-2">
            <Label htmlFor="source">
              {formData.type === 'book' ? 'Book Title' : 'Video Title'}
            </Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              disabled={loading}
              placeholder={
                formData.type === 'book' ? 'Book title' : 'Video title'
              }
            />
          </div>
        )}

        {/* Category */}
        {showCategory && (
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
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
          </div>
        )}

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
            disabled={loading}
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated tags
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
