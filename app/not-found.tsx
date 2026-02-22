'use client'

import Link from 'next/link'
import { Home, ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <FileQuestion className="w-32 h-32 text-accent-primary opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-6xl font-bold text-text-primary">404</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="font-mono text-4xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        <p className="font-serif text-xl text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Helpful Links */}
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6 mb-8">
          <p className="font-mono text-sm text-text-tertiary mb-4">
            You might be looking for:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 p-4 bg-bg-tertiary border border-border-default rounded hover:border-accent-primary transition-colors"
            >
              <Home className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-xs text-text-secondary">Home</span>
            </Link>
            <Link
              href="/projects"
              className="flex flex-col items-center gap-2 p-4 bg-bg-tertiary border border-border-default rounded hover:border-accent-primary transition-colors"
            >
              <FileQuestion className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-xs text-text-secondary">Projects</span>
            </Link>
            <Link
              href="/about"
              className="flex flex-col items-center gap-2 p-4 bg-bg-tertiary border border-border-default rounded hover:border-accent-primary transition-colors"
            >
              <FileQuestion className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-xs text-text-secondary">About</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center gap-2 p-4 bg-bg-tertiary border border-border-default rounded hover:border-accent-primary transition-colors"
            >
              <FileQuestion className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-xs text-text-secondary">Contact</span>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-elevated text-text-primary font-mono text-sm rounded hover:bg-bg-tertiary transition-colors border border-border-default"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <p className="font-mono text-xs text-text-tertiary mt-8">
          If you believe this is an error, please{' '}
          <Link href="/contact" className="text-accent-primary hover:underline">
            contact me
          </Link>
        </p>
      </div>
    </div>
  )
}
