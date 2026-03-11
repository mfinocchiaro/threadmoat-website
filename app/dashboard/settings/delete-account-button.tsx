"use client"

import { useState, useTransition } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { deleteAccount } from "@/app/actions/auth"

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteAccount()
      if (result.success) {
        await signOut({ callbackUrl: "/" })
      } else {
        setError(result.error || "Deletion failed")
        setConfirming(false)
      }
    })
  }

  if (!confirming) {
    return (
      <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
        Delete My Account
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-destructive font-medium">
        This will permanently delete your account, profile, and subscription. This cannot be undone.
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Yes, Delete Everything"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
