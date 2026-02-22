import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Sidebar from './Sidebar'
import type { SidebarBoard } from './Sidebar.types'

const boards: SidebarBoard[] = [
  { id: 'board-1', name: 'Platform Launch' },
  { id: 'board-2', name: 'Marketing Site' },
]

describe('Sidebar', () => {
  it('renders board list controls with count and create button text', () => {
    render(<Sidebar activeBoardId="board-1" boards={boards} />)

    expect(screen.getByText('ALL BOARDS (2)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Create New Board' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Platform Launch' })).toBeInTheDocument()
  })

  it('calls onBoardSelect with the clicked board id', async () => {
    const user = userEvent.setup()
    const handleBoardSelect = vi.fn()
    render(<Sidebar activeBoardId="board-1" boards={boards} onBoardSelect={handleBoardSelect} />)

    await user.click(screen.getByRole('button', { name: 'Marketing Site' }))

    expect(handleBoardSelect).toHaveBeenCalledTimes(1)
    expect(handleBoardSelect).toHaveBeenCalledWith('board-2')
  })

  it('renders the show-sidebar trigger when hidden and dispatches click handler', async () => {
    const user = userEvent.setup()
    const handleShowSidebar = vi.fn()
    render(<Sidebar activeBoardId="board-1" boards={boards} hidden onShowSidebar={handleShowSidebar} />)

    const showSidebarButton = screen.getByRole('button', { name: 'Show sidebar' })
    expect(showSidebarButton).toBeInTheDocument()

    await user.click(showSidebarButton)

    expect(handleShowSidebar).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(/ALL BOARDS/i)).not.toBeInTheDocument()
  })
})
