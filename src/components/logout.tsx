import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const LogoutButton = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <form action={signOut}>
      <button className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline">
        Logout
      </button>
    </form>
  )
}
