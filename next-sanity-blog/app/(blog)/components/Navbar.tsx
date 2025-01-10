import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-end">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-black hover:text-gray-700 text-xl font-bold px-6 py-2 transition-colors duration-200"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 