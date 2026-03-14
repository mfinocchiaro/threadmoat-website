'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { redeemInviteCode } from '@/app/actions/auth'

export function RedeemCodeForm() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const result = await redeemInviteCode(code)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setCode('')
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Enter invite code"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="flex-1 uppercase"
          disabled={loading || success}
        />
        <Button type="submit" disabled={loading || !code.trim() || success}>
          {loading ? 'Redeeming...' : 'Redeem'}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Code redeemed successfully! Your access has been upgraded.</p>}
    </form>
  )
}
