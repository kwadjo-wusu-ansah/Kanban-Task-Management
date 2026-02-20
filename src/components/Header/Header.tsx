import { useEffect, useRef } from 'react'
import { iconVerticalEllipsis, logoDark, logoLight } from '../../assets'
import { classNames } from '../../utils'
import { Button } from '../Button'
import styles from './Header.module.css'
import type { HeaderMode, HeaderProps } from './Header.types'

// Resolves the correct desktop logo source from the selected header mode.
function getLogoSource(mode: HeaderMode): string {
  return mode === 'dark' ? logoLight : logoDark
}

// Renders a reusable board header for light/dark mode and sidebar-visible layouts.
function Header({
  addTaskLabel = '+ Add New Task',
  boardName,
  className,
  isAddTaskDisabled = false,
  isMenuOpen = false,
  mode = 'light',
  onAddTask,
  onDeleteBoard,
  onEditBoard,
  onMenuClose,
  onMenuOpen,
  sidebarVisible = true,
  ...props
}: HeaderProps) {
  const shouldShowLogo = !sidebarVisible
  const menuRegionRef = useRef<HTMLDivElement | null>(null)

  // Closes the board action menu when clicks happen outside the menu trigger region.
  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    function handleOutsideMenuClick(event: MouseEvent) {
      if (!menuRegionRef.current) {
        return
      }

      if (menuRegionRef.current.contains(event.target as Node)) {
        return
      }

      onMenuClose?.()
    }

    window.addEventListener('mousedown', handleOutsideMenuClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideMenuClick)
    }
  }, [isMenuOpen, onMenuClose])

  return (
    <header
      className={classNames(
        styles.header,
        mode === 'dark' ? styles.dark : styles.light,
        sidebarVisible ? styles.sidebarVisible : styles.sidebarHidden,
        className,
      )}
      {...props}
    >
      <div className={styles.leadingGroup}>
        {shouldShowLogo ? <div className={styles.logoSlot}><img alt="Kanban" className={styles.logo} src={getLogoSource(mode)} /></div> : null}
        <h1 className={styles.title}>{boardName}</h1>
      </div>

      <div className={styles.actions}>
        <Button className={styles.addTaskButton} disabled={isAddTaskDisabled} onClick={onAddTask} size="large" variant="primary">
          {addTaskLabel}
        </Button>
        <div className={styles.menuRegion} ref={menuRegionRef}>
          <button aria-label="Open board actions" className={styles.menuButton} onClick={onMenuOpen} type="button">
            <img alt="" aria-hidden="true" className={styles.menuIcon} src={iconVerticalEllipsis} />
          </button>
          {isMenuOpen ? (
            <div className={styles.menu} role="menu">
              <button className={styles.menuAction} onClick={onEditBoard} role="menuitem" type="button">
                Edit Board
              </button>
              <button className={classNames(styles.menuAction, styles.menuActionDanger)} onClick={onDeleteBoard} role="menuitem" type="button">
                Delete Board
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
