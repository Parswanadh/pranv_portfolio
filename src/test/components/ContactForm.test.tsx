import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactForm } from '@/components/ContactForm'
import { vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

// Mock the PulseLoader component
vi.mock('@/components/skeletons/LoadingSkeleton', () => ({
  PulseLoader: () => <div data-testid="pulse-loader">Loading...</div>,
}))

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    fetch.mockClear()
  })

  it('should render all form fields', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/Name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message \*/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument()
  })

  it('should validate required fields on submit', async () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /Send Message/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Subject is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument()
    })
  })

  it('should validate name length', async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Name \*/i), {
      target: { value: 'A' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    await waitFor(() => {
      expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Email \*/i), {
      target: { value: 'invalid-email' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('should validate message length', async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: 'Hi' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    await waitFor(() => {
      expect(screen.getByText(/Please enter at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('should clear error when user starts typing', async () => {
    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/Name \*/i)

    // Submit to show error
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
    })

    // Start typing to clear error
    fireEvent.change(nameInput, { target: { value: 'John' } })

    await waitFor(() => {
      expect(screen.queryByText(/Name is required/i)).not.toBeInTheDocument()
    })
  })

  it('should show success message after successful submission', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Message sent successfully' }),
    })

    render(<ContactForm />)

    // Fill form
    fireEvent.change(screen.getByLabelText(/Name \*/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email \*/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Subject \*/i), {
      target: { value: 'Job Opportunity' },
    })
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: 'This is a test message' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByTestId('pulse-loader')).toBeInTheDocument()
    })

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument()
      expect(screen.getByText(/Thanks for reaching out, John!/i)).toBeInTheDocument()
    })

    // Form should be reset after timeout
    vi.advanceTimersByTime(3000)
    await waitFor(() => {
      expect(screen.getByLabelText(/Name \*/i)).toHaveValue('')
    })
  })

  it('should show error message on API failure', async () => {
    // Mock API error response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    })

    render(<ContactForm />)

    // Fill form
    fireEvent.change(screen.getByLabelText(/Name \*/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email \*/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Subject \*/i), {
      target: { value: 'Job Opportunity' },
    })
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: 'This is a test message' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Server error/i)).toBeInTheDocument()
    })
  })

  it('should handle network errors', async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<ContactForm />)

    // Fill form
    fireEvent.change(screen.getByLabelText(/Name \*/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email \*/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Subject \*/i), {
      target: { value: 'Job Opportunity' },
    })
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: 'This is a test message' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    // Should show network error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to send message\. Please try again or email directly\./i)).toBeInTheDocument()
    })
  })

  it('should include honeypot field in submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Message sent successfully' }),
    })

    render(<ContactForm />)

    // Fill form, including honeypot (simulating bot)
    fireEvent.change(screen.getByLabelText(/Name \*/i), {
      target: { value: 'Bot' },
    })
    fireEvent.change(screen.getByLabelText(/Email \*/i), {
      target: { value: 'bot@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Subject \*/i), {
      target: { value: 'Spam' },
    })
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: 'Spam message' },
    })
    fireEvent.change(screen.getByLabelText(/Leave this field empty/i), {
      target: { value: 'I am a bot' }, // Fill honeypot
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    // Should still show success (honeypot is detected but not revealed to bot)
    await waitFor(() => {
      expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument()
    })

    // Check that fetch was called with honeypot
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bot',
        email: 'bot@example.com',
        subject: 'Spam',
        message: 'Spam message',
        honeypot: 'I am a bot',
      }),
    })
  })

  it('should show character count for message field', () => {
    render(<ContactForm />)

    const messageInput = screen.getByLabelText(/Message \*/i)
    const characterCount = screen.getByText(/0 \/ 500 characters/i)

    expect(characterCount).toBeInTheDocument()

    // Type some characters
    fireEvent.change(messageInput, { target: { value: 'Hello world' } })
    expect(characterCount).toHaveTextContent(/12 \/ 500 characters/i)
  })

  it('should disable submit button during submission', async () => {
    // Mock a slow API response
    fetch.mockImplementationOnce(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Message sent successfully' }),
        }), 100)
      )
    )

    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /Send Message/i })

    // Fill form
    fireEvent.change(screen.getByLabelText(/Name \*/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email \*/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Subject \*/i), {
      target: { value: 'Job Opportunity' },
    })
    fireEvent.change(screen.getByLabelText(/Message \*/i), {
      target: { value: 'This is a test message' },
    })

    // Submit form
    fireEvent.click(submitButton)

    // Button should be disabled
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/Sending.../i)

    // Wait for submission to complete
    await vi.advanceTimersByTime(100)

    // Button should be enabled again
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should display different subject options', () => {
    render(<ContactForm />)

    const subjectSelect = screen.getByLabelText(/Subject \*/i)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(6) // 5 options + empty option
    expect(options[1]).toHaveTextContent(/Job Opportunity/i)
    expect(options[2]).toHaveTextContent(/Collaboration/i)
    expect(options[3]).toHaveTextContent(/Internship Inquiry/i)
    expect(options[4]).toHaveTextContent(/Project Feedback/i)
    expect(options[5]).toHaveTextContent(/Other/i)
  })
})