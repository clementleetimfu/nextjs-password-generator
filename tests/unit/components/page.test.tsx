import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'
import * as hooks from '@/hooks/use-password-generator'
import * as pinHooks from '@/hooks/use-pin-generator'
import * as passphraseHooks from '@/hooks/use-passphrase-generator'
import * as breachCheckHooks from '@/hooks/use-breach-check'
import * as themeHooks from '@/hooks/use-theme'
import { toast } from 'sonner'

// Mock all hooks
vi.mock('@/hooks/use-password-generator')
vi.mock('@/hooks/use-pin-generator')
vi.mock('@/hooks/use-passphrase-generator')
vi.mock('@/hooks/use-breach-check')
vi.mock('@/hooks/use-theme')
vi.mock('sonner')

describe('Home Page Component', () => {
  const mockPasswordGenerator = {
    state: {
      type: 'password' as const,
      value: 'TestPassword123!',
      length: 12,
      includeDigits: true,
      includeSymbols: true,
      includeUppercase: true,
      strength: 'STRONG' as const,
      breachCheck: 'idle' as const,
      breachCount: undefined,
    },
    generate: vi.fn(),
    setLength: vi.fn(),
    toggleDigits: vi.fn(),
    toggleSymbols: vi.fn(),
    toggleUppercase: vi.fn(),
    setBreachCheck: vi.fn(),
  }

  const mockPinGenerator = {
    state: {
      type: 'pin' as const,
      value: '123456',
      length: 6,
      strength: 'WEAK' as const,
      breachCheck: 'idle' as const,
      breachCount: undefined,
    },
    generate: vi.fn(),
    setLength: vi.fn(),
    setBreachCheck: vi.fn(),
  }

  const mockPassphraseGenerator = {
    state: {
      type: 'passphrase' as const,
      value: 'correct-horse-battery-staple',
      wordCount: 4,
      separator: 'hyphen' as const,
      strength: 'VERY_STRONG' as const,
      breachCheck: 'idle' as const,
      breachCount: undefined,
    },
    generate: vi.fn(),
    setWordCount: vi.fn(),
    setSeparator: vi.fn(),
    setBreachCheck: vi.fn(),
  }

  const mockBreachCheck = {
    status: 'idle' as const,
    count: undefined,
    error: undefined,
    performBreachCheck: vi.fn(),
    reset: vi.fn(),
  }

  const mockTheme = {
    mode: 'light' as const,
    setMode: vi.fn(),
    toggle: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(hooks.usePasswordGenerator).mockReturnValue(mockPasswordGenerator)
    vi.mocked(pinHooks.usePinGenerator).mockReturnValue(mockPinGenerator)
    vi.mocked(passphraseHooks.usePassphraseGenerator).mockReturnValue(mockPassphraseGenerator)
    vi.mocked(breachCheckHooks.useBreachCheck).mockReturnValue(mockBreachCheck)
    vi.mocked(themeHooks.useTheme).mockReturnValue(mockTheme)
    vi.mocked(toast.success).mockImplementation(() => 'toast-id')
  })

  describe('Component Rendering', () => {
    it('should render main page structure', () => {
      render(<Home />)
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })

    it('should render page title', () => {
      render(<Home />)
      expect(screen.getByText('Password Generator')).toBeInTheDocument()
    })

    it('should render tabs component', () => {
      render(<Home />)
      expect(screen.getByTestId('tabs')).toBeInTheDocument()
    })

    it('should render all three tabs', () => {
      render(<Home />)
      expect(screen.getByTestId('tab-password')).toBeInTheDocument()
      expect(screen.getByTestId('tab-pin')).toBeInTheDocument()
      expect(screen.getByTestId('tab-passphrase')).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('should default to password tab', () => {
      render(<Home />)
      expect(screen.getByTestId('tab-password')).toHaveAttribute('aria-selected', 'true')
    })

    it('should switch to PIN tab when clicked', async () => {
      render(<Home />)
      const pinTab = screen.getByTestId('tab-pin')
      fireEvent.click(pinTab)
      await waitFor(() => {
        expect(pinTab).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('should switch to passphrase tab when clicked', async () => {
      render(<Home />)
      const passphraseTab = screen.getByTestId('tab-passphrase')
      fireEvent.click(passphraseTab)
      await waitFor(() => {
        expect(passphraseTab).toHaveAttribute('aria-selected', 'true')
      })
    })
  })

  describe('Password Tab Content', () => {
    it('should render password display when password tab is active', () => {
      render(<Home />)
      expect(screen.getByText(mockPasswordGenerator.state.value)).toBeInTheDocument()
    })

    it('should call password generator on refresh', async () => {
      render(<Home />)
      const refreshButton = screen.getByRole('button', { name: /refresh/i })
      fireEvent.click(refreshButton)
      expect(mockPasswordGenerator.generate).toHaveBeenCalled()
    })

    it('should call copy handler on copy', async () => {
      render(<Home />)
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)
      expect(toast.success).toHaveBeenCalledWith('Copied to clipboard!')
    })

    it('should call breach check on breach check button click', async () => {
      vi.mocked(mockBreachCheck.performBreachCheck).mockResolvedValue({
        status: 'safe',
        count: 0,
      })

      render(<Home />)
      const breachCheckButton = screen.getByRole('button', { name: /check breach/i })
      fireEvent.click(breachCheckButton)

      await waitFor(() => {
        expect(mockBreachCheck.performBreachCheck).toHaveBeenCalledWith(
          mockPasswordGenerator.state.value
        )
        expect(mockPasswordGenerator.setBreachCheck).toHaveBeenCalledWith('safe', 0)
      })
    })
  })

  describe('PIN Tab Content', () => {
    it('should render PIN display when PIN tab is active', async () => {
      render(<Home />)
      const pinTab = screen.getByTestId('tab-pin')
      fireEvent.click(pinTab)

      await waitFor(() => {
        expect(screen.getByText(mockPinGenerator.state.value)).toBeInTheDocument()
      })
    })

    it('should call PIN generator on refresh', async () => {
      render(<Home />)
      const pinTab = screen.getByTestId('tab-pin')
      fireEvent.click(pinTab)

      await waitFor(() => {
        const refreshButton = screen.getByRole('button', { name: /refresh/i })
        fireEvent.click(refreshButton)
        expect(mockPinGenerator.generate).toHaveBeenCalled()
      })
    })
  })

  describe('Passphrase Tab Content', () => {
    it('should render passphrase display when passphrase tab is active', async () => {
      render(<Home />)
      const passphraseTab = screen.getByTestId('tab-passphrase')
      fireEvent.click(passphraseTab)

      await waitFor(() => {
        expect(screen.getByText(mockPassphraseGenerator.state.value)).toBeInTheDocument()
      })
    })

    it('should call passphrase generator on refresh', async () => {
      render(<Home />)
      const passphraseTab = screen.getByTestId('tab-passphrase')
      fireEvent.click(passphraseTab)

      await waitFor(() => {
        const refreshButton = screen.getByRole('button', { name: /refresh/i })
        fireEvent.click(refreshButton)
        expect(mockPassphraseGenerator.generate).toHaveBeenCalled()
      })
    })
  })

  describe('Theme Toggle', () => {
    it('should render theme toggle button', () => {
      render(<Home />)
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    })

    it('should call theme toggle on click', () => {
      render(<Home />)
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
      fireEvent.click(themeToggle)
      expect(mockTheme.toggle).toHaveBeenCalled()
    })
  })

  describe('Password Controls', () => {
    it('should render length slider', () => {
      render(<Home />)
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    it('should render digit toggle switch', () => {
      render(<Home />)
      expect(screen.getByRole('switch', { name: /digits/i })).toBeInTheDocument()
    })

    it('should call toggleDigits when digit switch is clicked', () => {
      render(<Home />)
      const digitSwitch = screen.getByRole('switch', { name: /digits/i })
      fireEvent.click(digitSwitch)
      expect(mockPasswordGenerator.toggleDigits).toHaveBeenCalled()
    })

    it('should render symbol toggle switch', () => {
      render(<Home />)
      expect(screen.getByRole('switch', { name: /symbols/i })).toBeInTheDocument()
    })

    it('should call toggleSymbols when symbol switch is clicked', () => {
      render(<Home />)
      const symbolSwitch = screen.getByRole('switch', { name: /symbols/i })
      fireEvent.click(symbolSwitch)
      expect(mockPasswordGenerator.toggleSymbols).toHaveBeenCalled()
    })

    it('should render uppercase toggle switch', () => {
      render(<Home />)
      expect(screen.getByRole('switch', { name: /uppercase/i })).toBeInTheDocument()
    })

    it('should call toggleUppercase when uppercase switch is clicked', () => {
      render(<Home />)
      const uppercaseSwitch = screen.getByRole('switch', { name: /uppercase/i })
      fireEvent.click(uppercaseSwitch)
      expect(mockPasswordGenerator.toggleUppercase).toHaveBeenCalled()
    })
  })

  describe('Integration with Hooks', () => {
    it('should use password generator hook', () => {
      render(<Home />)
      expect(hooks.usePasswordGenerator).toHaveBeenCalled()
    })

    it('should use PIN generator hook', () => {
      render(<Home />)
      expect(pinHooks.usePinGenerator).toHaveBeenCalled()
    })

    it('should use passphrase generator hook', () => {
      render(<Home />)
      expect(passphraseHooks.usePassphraseGenerator).toHaveBeenCalled()
    })

    it('should use breach check hook', () => {
      render(<Home />)
      expect(breachCheckHooks.useBreachCheck).toHaveBeenCalled()
    })

    it('should use theme hook', () => {
      render(<Home />)
      expect(themeHooks.useTheme).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<Home />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Password Generator')
    })

    it('should have proper tab roles', () => {
      render(<Home />)
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('should have proper button roles', () => {
      render(<Home />)
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
    })

    it('should have proper slider role', () => {
      render(<Home />)
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    it('should have proper switch roles', () => {
      render(<Home />)
      expect(screen.getAllByRole('switch')).toHaveLength(3)
    })
  })
})
