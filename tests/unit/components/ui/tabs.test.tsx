import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs Component', () => {
  describe('Basic Rendering', () => {
    it('should render tabs root element', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('should render tabs list element', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('should render tab triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers).toHaveLength(2)
    })

    it('should render tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })
  })

  describe('Default Value', () => {
    it('should activate default tab', () => {
      render(
        <Tabs defaultValue="tab2">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('should show content for default tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      expect(screen.getByText('Content 1')).toBeVisible()
    })

    it('should hide content for non-default tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      expect(screen.queryByText('Content 2')).not.toBeVisible()
    })
  })

  describe('Controlled Component', () => {
    it('should render controlled tabs', () => {
      const handleChange = vi.fn()
      render(
        <Tabs value="tab1" onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('should update active tab when value prop changes', () => {
      const { rerender } = render(
        <Tabs value="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[0]).toHaveAttribute('aria-selected', 'true')

      rerender(
        <Tabs value="tab2">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      expect(triggers[1]).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Tab Switching', () => {
    it('should switch tabs when trigger is clicked', () => {
      const handleChange = vi.fn()
      render(
        <Tabs defaultValue="tab1" onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      fireEvent.click(triggers[1])
      expect(handleChange).toHaveBeenCalledWith('tab2')
    })

    it('should update content when tab is switched', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')

      fireEvent.click(triggers[1])
      expect(screen.getByText('Content 2')).toBeVisible()
      expect(screen.queryByText('Content 1')).not.toBeVisible()
    })
  })

  describe('Disabled Tabs', () => {
    it('should render disabled tab trigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[1]).toBeDisabled()
      expect(triggers[1]).toHaveClass('disabled:pointer-events-none')
      expect(triggers[1]).toHaveClass('disabled:opacity-50')
    })

    it('should not switch to disabled tab', () => {
      const handleChange = vi.fn()
      render(
        <Tabs defaultValue="tab1" onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      fireEvent.click(triggers[1])
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom className to Tabs', () => {
      render(
        <Tabs defaultValue="tab1" className="custom-class">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('custom-class')
    })

    it('should apply custom className to TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-class">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('custom-class')
    })

    it('should apply custom className to TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-class">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[0]).toHaveClass('custom-class')
    })

    it('should apply custom className to TabsContent', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-class">
            Content 1
          </TabsContent>
        </Tabs>
      )
      expect(screen.getByText('Content 1')).toHaveClass('custom-class')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass id attribute to Tabs', () => {
      render(
        <Tabs defaultValue="tab1" id="test-tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveAttribute('id', 'test-tabs')
    })

    it('should pass id attribute to TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" id="tab-trigger-1">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tab')).toHaveAttribute('id', 'tab-trigger-1')
    })

    it('should pass data-testid attribute', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" data-testid="test-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByTestId('test-trigger')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have tablist role', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('should have tab role for triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers).toHaveLength(2)
    })

    it('should have aria-selected attribute for active tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('should have aria-selected attribute for inactive tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[1]).toHaveAttribute('aria-selected', 'false')
    })

    it('should have aria-controls attribute linking to content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const trigger = screen.getByRole('tab')
      expect(trigger).toHaveAttribute('aria-controls')
    })

    it('should have aria-labelledby attribute on content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const content = screen.getByText('Content 1')
      expect(content).toHaveAttribute('aria-labelledby')
    })
  })

  describe('Styling Classes', () => {
    it('should have inline-flex class on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('inline-flex')
    })

    it('should have h-9 class on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('h-9')
    })

    it('should have items-center class on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('items-center')
    })

    it('should have justify-center class on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('justify-center')
    })

    it('should have rounded-lg class on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tablist')).toHaveClass('rounded-lg')
    })
  })

  describe('State-based Styling', () => {
    it('should have active styling on active tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[0]).toHaveClass('data-[state=active]:bg-background')
      expect(triggers[0]).toHaveClass('data-[state=active]:text-foreground')
      expect(triggers[0]).toHaveClass('data-[state=active]:shadow')
    })
  })

  describe('Transitions', () => {
    it('should have transition-all class on TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[0]).toHaveClass('transition-all')
    })
  })

  describe('Focus Styles', () => {
    it('should have focus-visible styles on TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers[0]).toHaveClass('focus-visible:outline-none')
      expect(triggers[0]).toHaveClass('focus-visible:ring-2')
      expect(triggers[0]).toHaveClass('focus-visible:ring-ring')
    })

    it('should have focus-visible styles on TabsContent', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const content = screen.getByText('Content 1')
      expect(content).toHaveClass('focus-visible:outline-none')
      expect(content).toHaveClass('focus-visible:ring-2')
      expect(content).toHaveClass('focus-visible:ring-ring')
    })
  })

  describe('Edge Cases', () => {
    it('should handle single tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers).toHaveLength(1)
    })

    it('should handle many tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            <TabsTrigger value="tab4">Tab 4</TabsTrigger>
            <TabsTrigger value="tab5">Tab 5</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
          <TabsContent value="tab4">Content 4</TabsContent>
          <TabsContent value="tab5">Content 5</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')
      expect(triggers).toHaveLength(5)
    })

    it('should handle empty tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1"></TabsContent>
        </Tabs>
      )
      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('should handle rapid tab switching', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      )
      const triggers = screen.getAllByRole('tab')

      fireEvent.click(triggers[1])
      fireEvent.click(triggers[2])
      fireEvent.click(triggers[0])

      expect(screen.getByText('Content 1')).toBeVisible()
    })
  })
})
