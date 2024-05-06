'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { type ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'

type Props = ComponentProps<'button'> & {
  pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <Button
      formAction={props.formAction}
      disabled={isPending}
      variant="default"
      className="w-full"
    >
      {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? pendingText || children : children}
    </Button>
  )
}
