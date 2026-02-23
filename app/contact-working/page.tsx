'use client';

import { ContactForm } from '@/components/ContactForm-simple'
import { Mail, Github, Linkedin, Copy, Check, Phone } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [emailCopied, setEmailCopied] = useState(false)
  const [phoneCopied, setPhoneCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('prnvamara@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const copyPhone = () => {
    navigator.clipboard.writeText('+91 8341717162')
    setPhoneCopied(true)
    setTimeout(() => setPhoneCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            /contact
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Want to collaborate, ask a question, or just say hi? Here are all the ways
            to reach me.
          </p>
        </div>

        {/* Two Column Layout: Form + Contact Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form - Left Side */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Cards - Right Side */}
          <div className="space-y-4">
            {/* Email */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-lg text-white">prnvamara@gmail.com</p>
                  </div>
                </div>
                <button
                  onClick={copyEmail}
                  className="min-w-[100px] min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition-opacity focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 touch-manipulation"
                >
                  {emailCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{emailCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-lg text-white">+91 8341717162</p>
                  </div>
                </div>
                <button
                  onClick={copyPhone}
                  className="min-w-[100px] min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition-opacity focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 touch-manipulation"
                >
                  {phoneCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{phoneCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/PranavAmara05"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors group focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Github className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  <div>
                    <p className="text-sm text-gray-400">GitHub</p>
                    <p className="text-lg text-white">github.com/PranavAmara05</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">Open →</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/amara-pranav"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors group focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  <div>
                    <p className="text-sm text-gray-400">LinkedIn</p>
                    <p className="text-lg text-white">linkedin.com/in/amara-pranav</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">Open →</span>
              </div>
            </a>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-3">
            Response Time
          </h2>
          <p className="text-gray-300">
            I typically respond to emails and messages within 24-48 hours. Always open to
            discussing interesting projects, research collaborations, or internship opportunities.
          </p>
        </div>

        {/* Location */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-sm text-gray-400 mb-2">Location</h3>
            <p className="text-lg text-white">Ongole, India</p>
            <p className="text-sm text-gray-400">Open to opportunities</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-sm text-gray-400 mb-2">Status</h3>
            <p className="text-lg text-white">B.Tech Student</p>
            <p className="text-sm text-gray-400">Amrita Vishwa Vidyapeetham</p>
          </div>
        </div>
      </main>
    </div>
  )
}