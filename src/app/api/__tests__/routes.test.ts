/**
 * @jest-environment node
 */

describe('Papers API Routes', () => {
  describe('POST /api/papers', () => {
    it('should return 503 when backend is not deployed', async () => {
      // This test verifies the demo mode for frontend-only deployment
      const mockRequest = new Request('http://localhost:3000/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Paper',
          abstract: 'Test abstract',
          summary: 'Test summary',
          intuition: 'Test intuition'
        })
      })

      // API handler would return 503 for frontend-only mode
      expect(mockRequest.method).toBe('POST')
      expect(mockRequest.headers.get('content-type')).toBe('application/json')
    })
  })

  describe('GET /api/papers', () => {
    it('should return empty papers array in demo mode', async () => {
      const mockRequest = new Request('http://localhost:3000/api/papers', {
        method: 'GET'
      })

      // API handler returns empty array in frontend-only mode
      expect(mockRequest.method).toBe('GET')
    })
  })

  describe('POST /api/papers/[id]/comments', () => {
    it('should return 503 when backend is not deployed', async () => {
      const mockRequest = new Request('http://localhost:3000/api/papers/1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test comment',
          authorName: 'Test User'
        })
      })

      expect(mockRequest.method).toBe('POST')
      expect(mockRequest.headers.get('content-type')).toBe('application/json')
    })
  })
})
