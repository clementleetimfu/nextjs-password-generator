import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/page'
import * as passwordHooks from '@/hooks/use-password-generator'
import * as pinHooks from '@/hooks/use-pin-generator'
import * as passphraseHooks from '@/hooks/use-passphrase-generator'
import * as breachHooks from '@/hooks/use-breach-check'
import * as themeHooks from '@/hooks/use-theme'
import * as desktopHooks from '@/hooks/use-desktop'
import { toast } from 'sonner'

vi.mock('@/hooks/use-password-generator')
vi.mock('@/hooks/use-pin-generator')
vi.mock('@/hooks/use-passphrase-generator')
vi.mock('@/hooks/use-breach-check')
vi.mock('@/hooks/use-theme')
vi.mock('@/hooks/use-desktop')
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
    setValue: vi.fn(),
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
    setValue: vi.fn(),
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
    setValue: vi.fn(),
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
    vi.mocked(passwordHooks.usePasswordGenerator).mockReturnValue(mockPasswordGenerator)
    vi.mocked(pinHooks.usePinGenerator).mockReturnValue(mockPinGenerator)
    vi.mocked(passphraseHooks.usePassphraseGenerator).mockReturnValue(mockPassphraseGenerator)
    vi.mocked(breachHooks.useBreachCheck).mockReturnValue(mockBreachCheck)
    vi.mocked(themeHooks.useTheme).mockReturnValue(mockTheme)
    vi.mocked(desktopHooks.useDesktop).mockReturnValue(true)
    vi.mocked(toast.success).mockImplementation(() => 'toast-id')
  })

  it('renders the main structure', () => {
    render(<Home />)
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Password Generator' })).toBeInTheDocument()
  })

  it('renders all generator tabs', () => {
    render(<Home />)
    expect(screen.getByTestId('tab-password')).toBeInTheDocument()
    expect(screen.getByTestId('tab-pin')).toBeInTheDocument()
    expect(screen.getByTestId('tab-passphrase')).toBeInTheDocument()
  })

  it('renders default password state from hook', () => {
    render(<Home />)
    expect(screen.getByText(mockPasswordGenerator.state.value)).toBeInTheDocument()
  })

  it('calls password generate on refresh click', () => {
    render(<Home />)
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }))
    expect(mockPasswordGenerator.generate).toHaveBeenCalledTimes(1)
  })

  it('runs breach check and stores returned status', async () => {
    vi.mocked(mockBreachCheck.performBreachCheck).mockResolvedValue({ status: 'safe', count: 0 })

    render(<Home />)
    fireEvent.click(screen.getByRole('button', { name: /check breach/i }))

    await waitFor(() => {
      expect(mockBreachCheck.performBreachCheck).toHaveBeenCalledWith(mockPasswordGenerator.state.value)
      expect(mockPasswordGenerator.setBreachCheck).toHaveBeenCalledWith('safe', 0)
    })
  })

  it('toggles theme when theme button is clicked', () => {
    render(<Home />)
    fireEvent.click(screen.getByTestId('theme-toggle'))
    expect(mockTheme.toggle).toHaveBeenCalledTimes(1)
  })

  it('wires password switches to hook callbacks', () => {
    render(<Home />)
    const switches = screen.getAllByRole('switch')

    fireEvent.click(switches[0])
    fireEvent.click(switches[1])
    fireEvent.click(switches[2])

    expect(mockPasswordGenerator.toggleDigits).toHaveBeenCalledTimes(1)
    expect(mockPasswordGenerator.toggleSymbols).toHaveBeenCalledTimes(1)
    expect(mockPasswordGenerator.toggleUppercase).toHaveBeenCalledTimes(1)
  })

  it('invokes all generator/theme hooks', () => {
    render(<Home />)
    expect(passwordHooks.usePasswordGenerator).toHaveBeenCalled()
    expect(pinHooks.usePinGenerator).toHaveBeenCalled()
    expect(passphraseHooks.usePassphraseGenerator).toHaveBeenCalled()
    expect(breachHooks.useBreachCheck).toHaveBeenCalled()
    expect(themeHooks.useTheme).toHaveBeenCalled()
  })
})
