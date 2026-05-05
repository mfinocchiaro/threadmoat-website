'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', category: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you within 24 hours.
        </p>

        {status === 'success' && (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <AlertDescription className="text-green-900">
              ✓ Message sent successfully! We'll be in touch soon.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertDescription className="text-red-900">
              Failed to send message: {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'loading'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@company.com"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'loading'}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger disabled={status === 'loading'}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="sales">Sales Inquiry</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message..."
              rows={6}
              required
              value={formData.message}
              onChange={handleChange}
              disabled={status === 'loading'}
            />
          </div>

          <Button type="submit" disabled={status === 'loading'} className="w-full">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Other ways to reach us</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <strong>Support:</strong>{' '}
              <a href="mailto:support@threadmoat.com" className="underline underline-offset-4">
                support@threadmoat.com
              </a>
            </li>
            <li>
              <strong>Sales:</strong>{' '}
              <a href="mailto:sales@threadmoat.com" className="underline underline-offset-4">
                sales@threadmoat.com
              </a>
            </li>
            <li>
              <strong>Privacy inquiries:</strong>{' '}
              <a href="mailto:privacy@threadmoat.com" className="underline underline-offset-4">
                privacy@threadmoat.com
              </a>
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground border-t mt-8 pt-6">
          <Link href="/" className="underline underline-offset-4">
            ← Back to ThreadMoat
          </Link>
        </p>
      </div>
    </div>
  )
}
