'use client'

import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'

const LIST_TYPES = [
  { value: 'kitap', label: 'Kitap' },
  { value: 'film', label: 'Film & Dizi' },
  { value: 'urun', label: 'Ürün' },
]

export function ListItemsForm({ item, onSuccess }) {
  const isEdit = !!item
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    list_type: item?.list_type || 'kitap',
    name: item?.name || '',
    author: item?.author || '',
    description: item?.description || '',
    is_completed: item?.is_completed || false,
    is_liked: item?.is_liked || false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        list_type: formData.list_type,
        name: formData.name,
        author: formData.author || null,
        description: formData.description || null,
        is_completed: formData.is_completed,
        is_liked: formData.is_liked,
      }

      const url = isEdit
        ? `/api/admin/list-items/${item.id}`
        : '/api/admin/list-items'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save item')
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving item:', err)
      setError(err.message || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  const showAuthor = formData.list_type === 'kitap' || formData.list_type === 'film'

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? 'Edit List Item' : 'Create List Item'}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'Update the list item details below.'
            : 'Fill in the details to create a new list item.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* List Type */}
        <div className="space-y-2">
          <Label htmlFor="list_type">Type *</Label>
          <Select
            value={formData.list_type}
            onValueChange={(value) =>
              setFormData({ ...formData, list_type: value })
            }
            disabled={isEdit || loading}
          >
            <SelectTrigger>
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
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={loading}
            placeholder={
              formData.list_type === 'kitap'
                ? 'Book title'
                : formData.list_type === 'film'
                ? 'Movie/Series title'
                : 'Product name'
            }
          />
        </div>

        {/* Author */}
        {showAuthor && (
          <div className="space-y-2">
            <Label htmlFor="author">
              {formData.list_type === 'kitap' ? 'Author' : 'Director'}
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              disabled={loading}
              placeholder={
                formData.list_type === 'kitap' ? 'Author name' : 'Director name'
              }
            />
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={loading}
            placeholder="Optional description"
            rows={3}
          />
        </div>

        {/* Status Toggles */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_completed">Completed</Label>
              <p className="text-xs text-muted-foreground">
                Mark this item as completed
              </p>
            </div>
            <Switch
              id="is_completed"
              checked={formData.is_completed}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_completed: checked })
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_liked">Liked</Label>
              <p className="text-xs text-muted-foreground">
                Mark this item as liked/favorite
              </p>
            </div>
            <Switch
              id="is_liked"
              checked={formData.is_liked}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_liked: checked })
              }
              disabled={loading}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="submit" disabled={loading || !formData.name}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
