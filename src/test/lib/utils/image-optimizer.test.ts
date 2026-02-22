import {
  getWebpSrc,
  getResponsiveSizes,
  optimizedImages,
  OptimizedImage,
  isWebpSupported,
  formatFileSize
} from '@/lib/utils/image-optimizer'
import { vi } from 'vitest'

// Mock document and canvas
const mockCanvas = {
  width: 1,
  height: 1,
  toDataURL: vi.fn(),
}

const mockDocument = {
  createElement: vi.fn(() => mockCanvas),
}

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
})

describe('image-optimizer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,...')
  })

  describe('getWebpSrc', () => {
    it('should convert JPEG to WebP when browser supports WebP', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,...')

      const result = getWebpSrc('/image.jpg')
      expect(result).toBe('/image.webp')
    })

    it('should convert PNG to WebP when browser supports WebP', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,...')

      const result = getWebpSrc('/image.png')
      expect(result).toBe('/image.webp')
    })

    it('should not convert when browser does not support WebP', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/png;base64,...')

      const result = getWebpSrc('/image.jpg')
      expect(result).toBe('/image.jpg')
    })

    it('should return original path for non-image files', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,...')

      const result = getWebpSrc('/document.pdf')
      expect(result).toBe('/document.pdf')
    })

    it('should handle server-side rendering (no window)', () => {
      // Temporarily remove window
      const originalWindow = global.window
      global.window = undefined as any

      const result = getWebpSrc('/image.jpg')
      expect(result).toBe('/image.webp')

      // Restore window
      global.window = originalWindow
    })
  })

  describe('getResponsiveSizes', () => {
    it('should return default responsive sizes', () => {
      const result = getResponsiveSizes()

      expect(result).toContain('(max-width: 640px)')
      expect(result).toContain('(max-width: 750px)')
      expect(result).toContain('(max-width: 828px)')
      expect(result).toContain('(max-width: 1080px)')
      expect(result).toContain('(max-width: 1200px)')
      expect(result).toContain('(max-width: 1920px)')
      expect(result).toContain('300px')
    })

    it('should use custom width', () => {
      const result = getResponsiveSizes(400)

      expect(result).toContain('210px') // 400 * 0.7 = 280, rounded down to 210
      expect(result).toContain('400px')
    })

    it('should handle custom breakpoints', () => {
      const customBreakpoints = ['320px', '768px']
      const result = getResponsiveSizes(300, customBreakpoints)

      expect(result).toContain('(max-width: 320px)')
      expect(result).toContain('(max-width: 768px)')
      expect(result).not.toContain('(max-width: 640px)')
    })

    it('should calculate sizes correctly', () => {
      const result = getResponsiveSizes(100)

      // Check that sizes are 70% of default
      expect(result).toContain('(max-width: 640px) 70') // 100 * 0.7 = 70
      expect(result).toContain('(max-width: 750px) 70')
      expect(result).toContain('100px')
    })
  })

  describe('optimizedImages', () => {
    it('should contain profile configuration', () => {
      expect(optimizedImages.profile).toEqual({
        src: '/parshu_img.webp',
        width: 300,
        height: 300,
        sizes: expect.any(String),
        priority: true,
        className: 'w-full h-full object-cover object-top',
      })
    })

    it('should contain icon configuration', () => {
      expect(optimizedImages.icon).toEqual({
        width: 192,
        height: 192,
        sizes: '192px',
      })
    })

    it('should contain apple touch configuration', () => {
      expect(optimizedImages.appleTouch).toEqual({
        width: 180,
        height: 180,
        sizes: '180px',
      })
    })
  })

  describe('OptimizedImage', () => {
    it('should return image object with WebP source', () => {
      const props = {
        src: '/image.jpg',
        alt: 'Test image',
        width: 300,
        height: 200,
      }

      const result = OptimizedImage(props)

      expect(result).toEqual({
        src: '/image.webp', // Should be converted to WebP
        alt: 'Test image',
        width: 300,
        height: 200,
        priority: false,
        className: '',
        sizes: expect.any(String),
        loading: 'lazy',
      })
    })

    it('should use custom props when provided', () => {
      const props = {
        src: '/image.png',
        alt: 'Custom image',
        width: 500,
        height: 300,
        priority: true,
        className: 'custom-class',
        sizes: '100vw',
      }

      const result = OptimizedImage(props)

      expect(result.src).toBe('/image.webp')
      expect(result.priority).toBe(true)
      expect(result.className).toBe('custom-class')
      expect(result.sizes).toBe('100vw')
    })

    it('should use default values for optional props', () => {
      const props = {
        src: '/image.jpg',
        alt: 'Test image',
      }

      const result = OptimizedImage(props)

      expect(result.width).toBe(300)
      expect(result.height).toBe(300)
      expect(result.priority).toBe(false)
      expect(result.className).toBe('')
      expect(result.sizes).toEqual(getResponsiveSizes())
    })
  })

  describe('isWebpSupported', () => {
    it('should return true when browser supports WebP', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,...')

      const result = isWebpSupported()
      expect(result).toBe(true)
    })

    it('should return false when browser does not support WebP', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/png;base64,...')

      const result = isWebpSupported()
      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', () => {
      mockCanvas.toDataURL.mockImplementation(() => {
        throw new Error('Canvas not supported')
      })

      const result = isWebpSupported()
      expect(result).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(500)).toBe('500 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1572864)).toBe('1.53 MB')
      expect(formatFileSize(1073741824)).toBe('1.07 GB')
    })

    it('should round to two decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1573)).toBe('1.54 KB')
      expect(formatFileSize(1049600)).toBe('1.02 MB')
    })

    it('should handle negative numbers', () => {
      expect(formatFileSize(-100)).toBe('-100 Bytes')
    })

    it('should handle very large numbers', () => {
      const largeNumber = Math.pow(1024, 4) // 1 TB
      expect(formatFileSize(largeNumber)).toBe('1 TB')
    })
  })

  describe('edge cases', () => {
    it('should handle malformed image paths', () => {
      const result = getWebpSrc('invalid-image-path')
      expect(result).toBe('invalid-image-path')
    })

    it('should handle empty string path', () => {
      const result = getWebpSrc('')
      expect(result).toBe('')
    })

    it('should handle very large responsive sizes calculation', () => {
      const result = getResponsiveSizes(2000)
      expect(result).toContain('(max-width: 640px) 1400') // 2000 * 0.7 = 1400
      expect(result).toContain('2000px')
    })

    it('should handle zero width in responsive sizes', () => {
      const result = getResponsiveSizes(0)
      expect(result).toContain('(max-width: 640px) 0')
      expect(result).toContain('0px')
    })
  })
})