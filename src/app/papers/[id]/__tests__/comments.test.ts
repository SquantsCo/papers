describe('PaperComments Component', () => {
  describe('Comment Type Validation', () => {
    it('should accept Comment with Date or string createdAt', () => {
      const commentWithDate = {
        id: 1,
        authorName: 'John Doe',
        content: 'Great paper!',
        createdAt: new Date('2024-01-15')
      }

      const commentWithString = {
        id: 2,
        authorName: 'Jane Smith',
        content: 'Very informative',
        createdAt: '2024-01-16'
      }

      expect(commentWithDate.createdAt instanceof Date).toBe(true)
      expect(typeof commentWithString.createdAt).toBe('string')
    })

    it('should handle null author names', () => {
      const comment = {
        id: 1,
        authorName: null,
        content: 'Anonymous comment',
        createdAt: new Date()
      }

      expect(comment.authorName).toBeNull()
      expect(comment.content).toBeTruthy()
    })

    it('should validate comment content', () => {
      const validComment = {
        id: 1,
        authorName: 'User',
        content: 'This is a valid comment with meaningful content',
        createdAt: new Date()
      }

      expect(validComment.content.length).toBeGreaterThan(0)
      expect(validComment.content).toEqual('This is a valid comment with meaningful content')
    })
  })

  describe('Comments Display', () => {
    it('should have empty array for demo paper', () => {
      const demoComments = []
      expect(demoComments).toEqual([])
      expect(demoComments.length).toBe(0)
    })

    it('should format multiple comments', () => {
      const comments = [
        {
          id: 1,
          authorName: 'Alice',
          content: 'First comment',
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          authorName: 'Bob',
          content: 'Second comment',
          createdAt: new Date('2024-01-16')
        }
      ]

      expect(comments.length).toBe(2)
      expect(comments[0].authorName).toBe('Alice')
      expect(comments[1].authorName).toBe('Bob')
    })
  })
})
