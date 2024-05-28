'use client'

import Link from 'next/link'
import { UserDropdown } from './user-dropdown'

export function Header() {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-14 w-full items-center justify-center border-b border-gray-200 bg-white">
      <div className="flex h-full w-full items-center justify-between px-3 md:px-6">
        <div className="flex w-full items-center justify-start">
          <Link href="/">
            <h4 className="cursor-pointer text-2xl font-light">CSMS</h4>
          </Link>
        </div>

        <nav className="hidden w-full items-center justify-center gap-x-10 xl:flex">
          <Link className="text-sm font-medium hover:underline" href="/">
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:underline"
            href={`/upload`}
          >
            Upload
          </Link>
          <Link
            className="text-sm font-medium hover:underline"
            href={`/cost-estimation`}
          >
            Cost Estimation
          </Link>
          <Link className="text-sm font-medium hover:underline" href="/profile">
            Profile
          </Link>
        </nav>

        <div className="flex w-full items-center justify-end">
          <UserDropdown />
        </div>
      </div>
    </div>
  )
}
