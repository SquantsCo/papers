import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    const heading = screen.getByText(/A hub for/)
    expect(heading).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<HomePage />)
    const browseLink = screen.getByText(/Browse explained papers/)
    const submitLink = screen.getByText(/Submit your explainer/)
    
    expect(browseLink).toBeInTheDocument()
    expect(submitLink).toBeInTheDocument()
  })

  it('displays the tagline', () => {
    render(<HomePage />)
    const tagline = screen.getByText(/quantum papers & beginner pathways/)
    expect(tagline).toBeInTheDocument()
  })

  it('renders the quantum quantum ecosystem message', () => {
    render(<HomePage />)
    const message = screen.getByText(/quantum ecosystem/)
    expect(message).toBeInTheDocument()
  })

  it('has correct links navigation', () => {
    render(<HomePage />)
    const browseLink = screen.getByRole('link', { name: /Browse explained papers/ })
    const submitLink = screen.getByRole('link', { name: /Submit your explainer/ })
    
    expect(browseLink).toHaveAttribute('href', '/papers')
    expect(submitLink).toHaveAttribute('href', '/papers/submit')
  })
})
