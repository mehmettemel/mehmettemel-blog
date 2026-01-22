import { AdminTabs } from '@/components/admin/AdminTabs'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your content',
}

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your notes, lists, and recipes
        </p>
      </div>

      <AdminTabs />
    </div>
  )
}
