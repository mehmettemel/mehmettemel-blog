import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout({ children }) {
  return (
    <div className="relative flex w-full flex-col min-h-screen">
      <Navbar />
      <main className="flex-auto">{children}</main>
      <Footer />
    </div>
  )
}
