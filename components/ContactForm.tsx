'use client'

import { useState } from 'react'
import { Mail, Send, Check, AlertCircle } from 'lucide-react'
import { PulseLoader } from '@/components/skeletons/LoadingSkeleton'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  honeypot: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please enter at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          honeypot: formData.honeypot,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' })
        setIsSubmitted(false)
      }, 3000)

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again or email directly.')
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-900/20 border border-green-500 rounded-lg p-8 text-center animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
        <p className="text-text-secondary">
          Thanks for reaching out, {formData.name}! I'll get back to you within 24-48 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-text-primary mb-6">Send a Message</h2>

      {/* Demo Mode Notice */}
      <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-accent-primary">
          <strong>Demo Mode:</strong> Messages are logged but not sent via email.
          For direct contact, please email <a href="mailto:prnvamara@gmail.com" className="underline hover:text-accent-secondary">prnvamara@gmail.com</a>
        </p>
      </div>

      {submitError && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Hidden honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="honeypot">Leave this field empty</label>
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          className="fixed top-0 left-0 w-[1px] h-[1px] opacity-0"
        />
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-mono text-text-secondary mb-2">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-bg-tertiary border ${
            errors.name ? 'border-red-500' : 'border-border-default'
          } rounded font-mono text-sm text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none touch-manipulation`}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400 font-mono">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-mono text-text-secondary mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-bg-tertiary border ${
            errors.email ? 'border-red-500' : 'border-border-default'
          } rounded font-mono text-sm text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none touch-manipulation`}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400 font-mono">{errors.email}</p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-mono text-text-secondary mb-2">
          Subject <span className="text-red-400">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-bg-tertiary border ${
            errors.subject ? 'border-red-500' : 'border-border-default'
          } rounded font-mono text-sm text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none touch-manipulation`}
        >
          <option value="">Select a topic</option>
          <option value="job-opportunity">Job Opportunity</option>
          <option value="collaboration">Collaboration</option>
          <option value="internship">Internship Inquiry</option>
          <option value="project-feedback">Project Feedback</option>
          <option value="other">Other</option>
        </select>
        {errors.subject && (
          <p className="mt-1 text-sm text-red-400 font-mono">{errors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-mono text-text-secondary mb-2">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          maxLength={500}
          className={`w-full px-4 py-3 bg-bg-tertiary border ${
            errors.message ? 'border-red-500' : 'border-border-default'
          } rounded font-mono text-sm text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none resize-none touch-manipulation`}
          placeholder="Tell me about your opportunity or question..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400 font-mono">{errors.message}</p>
        )}
        <p className="mt-1 text-xs text-text-tertiary font-mono">
          {formData.message.length} / 500 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-8 py-3 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
      >
        {isSubmitting ? (
          <>
            <PulseLoader size="sm" className="!text-white" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-text-tertiary font-mono">
        Or email directly at <a href="mailto:prnvamara@gmail.com" className="text-accent-primary hover:underline">prnvamara@gmail.com</a>
      </p>
    </form>
  )
}
