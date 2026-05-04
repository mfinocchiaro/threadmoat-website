import Image from "next/image"
import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Paywall({ user }: { user: { email?: string | null } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="https://threadmoat.vercel.app/finocchiaro-logo.png" alt="ThreadMoat" width={160} height={32} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user.email}</span>
          </div>
        </div>
      </header>
      {/* Paywall Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Enterprise Access Required</h1>
          <p className="mt-4 text-muted-foreground">
            You&apos;re signed in as {user.email}. Full dashboard access is available
            through an Enterprise engagement. Contact us to get started.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-md text-center">
          <a href="/about#contact">
            <Button size="lg" className="w-full">Book an Intro Call</Button>
          </a>
          <Link href="/pricing" className="inline-block mt-4">
            <Button variant="ghost">View Plans</Button>
          </Link>
        </div>
        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
