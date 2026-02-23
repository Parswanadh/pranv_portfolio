'use client';

import { useState } from 'react'

export default function ContactPage() {
  const [emailCopied, setEmailCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('prnvamara@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-4">/contact</h1>
        <p className="text-gray-300 mb-8">
          Want to collaborate, ask a question, or just say hi?
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Simple Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white">
                  <option value="">Select a topic</option>
                  <option value="job-opportunity">Job Opportunity</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="internship">Internship Inquiry</option>
                  <option value="project-feedback">Project Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white resize-none"
                  placeholder="Tell me about your opportunity or question..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg text-white">prnvamara@gmail.com</p>
                </div>
                <button
                  onClick={copyEmail}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  {emailCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-lg text-white">+91 8341717162</p>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-sm text-gray-400 mb-2">Location</h3>
              <p className="text-lg text-white">Ongole, India</p>
              <p className="text-sm text-gray-400">Open to opportunities</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-sm text-gray-400 mb-2">Response Time</h3>
              <p className="text-gray-300">
                I typically respond to emails and messages within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}