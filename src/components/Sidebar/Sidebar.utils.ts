import { iconBoard, iconBoardPurple, iconBoardWhite } from '../../assets'
import type { SidebarBoard } from './Sidebar.types'

// Resolves the board counter value shown in the "ALL BOARDS" heading.
export function getBoardCount(boardCount: number | undefined, boards: SidebarBoard[]): number {
  return typeof boardCount === 'number' ? boardCount : boards.length
}

// Resolves each board-row icon source by active and create-row states.
export function getBoardIconSource(isActive: boolean, isCreateRow: boolean): string {
  if (isActive) {
    return iconBoardWhite
  }

  if (isCreateRow) {
    return iconBoardPurple
  }

  return iconBoard
}
