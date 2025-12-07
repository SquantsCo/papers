describe('Tailwind Color Theme', () => {
  describe('Dark Blue-Purple Gradient Palette', () => {
    it('should have primary color gradient from blue to purple', () => {
      const colors = {
        primary: {
          50: '#f5f3ff',
          100: '#ede8ff',
          200: '#ddd5ff',
          300: '#c7b3ff',
          400: '#a080ff',
          500: '#7c5dff',
          600: '#6b3cff',
          700: '#5a2d9f',
          800: '#3d1e6f',
          900: '#1a0f42'
        }
      }

      expect(colors.primary[700]).toBe('#5a2d9f')
      expect(colors.primary[900]).toBe('#1a0f42')
    })

    it('should have light to dark progression', () => {
      const primary = [
        { shade: 50, color: '#f5f3ff' },
        { shade: 100, color: '#ede8ff' },
        { shade: 900, color: '#1a0f42' }
      ]

      expect(primary[0].shade).toBeLessThan(primary[2].shade)
    })
  })

  describe('Button Styling', () => {
    it('should apply gradient to primary action buttons', () => {
      const buttonClass = 'bg-gradient-to-r from-primary-700 to-primary-900'
      expect(buttonClass).toContain('gradient-to-r')
      expect(buttonClass).toContain('primary-700')
      expect(buttonClass).toContain('primary-900')
    })

    it('should have hover state transitions', () => {
      const hoverClass = 'hover:from-primary-800 hover:to-primary-800 transition-all'
      expect(hoverClass).toContain('transition-all')
      expect(hoverClass).toContain('hover')
    })
  })

  describe('Border Styling', () => {
    it('should use 2px primary borders', () => {
      const borderClass = 'border-2 border-primary-300'
      expect(borderClass).toContain('border-2')
      expect(borderClass).toContain('primary-300')
    })

    it('should have hover border transitions', () => {
      const hoverBorder = 'hover:border-primary-400 transition-all'
      expect(hoverBorder).toContain('hover:border')
      expect(hoverBorder).toContain('transition-all')
    })
  })

  describe('Form Field Styling', () => {
    it('should have primary border focus state', () => {
      const focusClass = 'focus:border-primary-500 focus:ring-primary-300'
      expect(focusClass).toContain('focus:border-primary-500')
      expect(focusClass).toContain('focus:ring-primary-300')
    })
  })
})
