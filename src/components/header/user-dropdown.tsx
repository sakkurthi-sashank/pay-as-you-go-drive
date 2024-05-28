'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const UserDropdown = () => {
  const { user } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex w-full items-center justify-center md:justify-start">
          <Avatar>
            <AvatarImage src={user?.user_metadata.avatar_url || ''} />
            <AvatarFallback>
              {user?.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2 hidden flex-col items-start md:flex">
            <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
              {user?.user_metadata.full_name ?? user?.email?.split('@')[0]}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              {user?.email}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
