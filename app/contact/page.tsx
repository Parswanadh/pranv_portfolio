'use client';

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'
import { MagneticButton } from '@/components/MagneticButton'
import { MagneticWrapper } from '@/components/MagneticWrapper'
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
    navigator.clipboard.writeText('+91 83174 93825')
    setPhoneCopied(true)
    setTimeout(() => setPhoneCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-mono text-4xl font-bold text-text-primary mb-4">
              Get In Touch
            </h1>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              Have a question or want to collaborate? I'd love to hear from you!
            </p>
          </div>

          {/* Two Column Layout: Form + Contact Info */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form - Left Side */}
            <div className="order-2 lg:order-1">
              <ContactForm />
            </div>

            {/* Contact Cards - Right Side */}
            <div className="space-y-4 order-1 lg:order-2">
            {/* Email */}
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-accent-primary" />
                  <div>
                    <p className="font-mono text-sm text-text-tertiary">Email</p>
                    <p className="font-mono text-lg text-text-primary">prnvamara@gmail.com</p>
                  </div>
                </div>
                <button
                  onClick={copyEmail}
                  className="min-w-[100px] min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-bg-elevated text-text-primary font-mono text-sm rounded hover:opacity-90 transition-opacity focus:ring-2 focus:ring-accent-primary focus:outline-none active:scale-95 touch-manipulation"
                >
                  {emailCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{emailCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-accent-primary" />
                  <div>
                    <p className="font-mono text-sm text-text-tertiary">Phone</p>
                    <p className="font-mono text-lg text-text-primary">+91 83174 93825</p>
                  </div>
                </div>
                <button
                  onClick={copyPhone}
                  className="min-w-[100px] min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-bg-elevated text-text-primary font-mono text-sm rounded hover:opacity-90 transition-opacity focus:ring-2 focus:ring-accent-primary focus:outline-none active:scale-95 touch-manipulation"
                >
                  {phoneCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{phoneCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* GitHub */}
            <MagneticWrapper strength={0.05}>
              <a
                href="https://github.com/PranavAmara05"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-bg-secondary border border-border-default rounded-lg p-6 hover:border-accent-primary transition-colors group focus:ring-2 focus:ring-accent-primary focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Github className="w-6 h-6 text-text-secondary group-hover:text-accent-primary transition-colors" />
                    <div>
                      <p className="font-mono text-sm text-text-tertiary">GitHub</p>
                      <p className="font-mono text-lg text-text-primary">github.com/PranavAmara05</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-text-tertiary">Open →</span>
                </div>
              </a>
            </MagneticWrapper>

            {/* LinkedIn */}
            <MagneticWrapper strength={0.05}>
              <a
                href="https://linkedin.com/in/amara-pranav"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-bg-secondary border border-border-default rounded-lg p-6 hover:border-accent-primary transition-colors group focus:ring-2 focus:ring-accent-primary focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Linkedin className="w-6 h-6 text-text-secondary group-hover:text-accent-primary transition-colors" />
                    <div>
                      <p className="font-mono text-sm text-text-tertiary">LinkedIn</p>
                      <p className="font-mono text-lg text-text-primary">linkedin.com/in/amara-pranav</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-text-tertiary">Open →</span>
                </div>
              </a>
            </MagneticWrapper>
          </div>

          {/* Response Time Notice */}
          <div className="bg-bg-tertiary border border-border-default rounded-lg p-6">
            <h2 className="font-mono text-lg font-bold text-text-primary mb-3">
              Response Time
            </h2>
            <p className="font-serif text-text-secondary">
              I typically respond to emails and messages within 24-48 hours. Always open to
              discussing interesting projects, research collaborations, or internship opportunities.
            </p>
          </div>

          {/* Location */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
              <h3 className="font-mono text-sm text-text-tertiary mb-2">Location</h3>
              <p className="font-mono text-lg text-text-primary">Bangalore, India</p>
              <p className="font-mono text-sm text-text-secondary">Open to opportunities</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
              <h3 className="font-mono text-sm text-text-tertiary mb-2">Status</h3>
              <p className="font-mono text-lg text-text-primary">B.Tech Student</p>
              <p className="font-mono text-sm text-text-secondary">Amrita Vishwa Vidyapeetham</p>
            </div>
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
