'use client'

import { Header } from '@/components/header'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setUser, isUserLoading, setIsUserLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    setIsUserLoading(true)
    fetchUser()
    setIsUserLoading(false)
  }, []) // eslint-disable-line

  if (isUserLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="mt-14">{children}</div>
    </div>
  )
}
