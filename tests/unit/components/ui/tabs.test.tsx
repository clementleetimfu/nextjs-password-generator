import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs Component', () => {
  const renderTabs = (value?: string) =>
    render(
      <Tabs defaultValue="tab1" value={value}>
        <TabsList data-testid="tab-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

  it('renders tab list and triggers', () => {
    renderTabs()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('activates default tab content', () => {
    renderTabs()
    expect(screen.getByText('Content 1')).toBeVisible()
  })

  it('supports controlled active tab via value prop', () => {
    renderTabs('tab2')
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')
  })

  it('applies className on list/trigger/content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="list-class">
          <TabsTrigger value="tab1" className="trigger-class">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="content-class">
          Content 1
        </TabsContent>
      </Tabs>
    )

    expect(screen.getByRole('tablist')).toHaveClass('list-class')
    expect(screen.getByRole('tab')).toHaveClass('trigger-class')
    expect(screen.getByText('Content 1')).toHaveClass('content-class')
  })
})
