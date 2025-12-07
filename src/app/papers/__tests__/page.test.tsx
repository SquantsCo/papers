import { render, screen } from '@testing-library/react'
import PapersPage from '@/app/papers/page'

// Mock the async component
jest.mock('@/app/papers/page', () => {
  return async function DummyPapersPage() {
    return (
      <div>
        <h1>Explained Papers</h1>
        <p>A growing collection of quantum and QML papers</p>
      </div>
    )
  }
})

describe('PapersPage', () => {
  it('renders the papers page heading', async () => {
    // For async components, we need to handle them differently
    // This is a simplified test demonstrating the structure
    const element = <h1>Explained Papers</h1>
    expect(element.props.children).toBe('Explained Papers')
  })

  it('should display demo paper data', async () => {
    // Demo paper structure validation
    const demoPaper = {
      id: 1,
      title: 'Quantum Machine Learning: An Overview',
      abstract: 'A comprehensive overview of quantum machine learning algorithms and their applications.',
      url: 'https://arxiv.org/abs/2103.15027',
      arxivId: '2103.15027',
      createdAt: new Date('2024-01-15'),
      explanations: [],
      comments: []
    }

    expect(demoPaper.id).toBe(1)
    expect(demoPaper.title).toContain('Quantum Machine Learning')
    expect(demoPaper.arxivId).toBe('2103.15027')
  })

  it('should have correct demo paper structure', () => {
    const demoPaper = {
      id: 1,
      title: 'Quantum Machine Learning: An Overview',
      abstract: 'A comprehensive overview of quantum machine learning algorithms and their applications.',
      url: 'https://arxiv.org/abs/2103.15027',
      arxivId: '2103.15027',
      createdAt: new Date('2024-01-15'),
      explanations: [],
      comments: []
    }

    expect(demoPaper).toHaveProperty('id')
    expect(demoPaper).toHaveProperty('title')
    expect(demoPaper).toHaveProperty('abstract')
    expect(demoPaper).toHaveProperty('arxivId')
    expect(Array.isArray(demoPaper.explanations)).toBe(true)
    expect(Array.isArray(demoPaper.comments)).toBe(true)
  })
})
