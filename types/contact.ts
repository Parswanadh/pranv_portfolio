// Contact form types
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  honeypot?: string
}

export interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export interface ContactFormResponse {
  success: boolean
  message: string
  error?: string
}

export type ContactSubject =
  | 'job-opportunity'
  | 'collaboration'
  | 'internship'
  | 'project-feedback'
  | 'other'
