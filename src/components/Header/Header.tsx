import { useEffect, useRef } from 'react'
import { iconAddTaskMobile, iconChevronDown, iconVerticalEllipsis, logoDark, logoLight, logoMobile } from '../../assets'
import { classNames } from '../../utils'
import { Button } from '../Button'
import styles from './Header.module.css'
import type { HeaderMode, HeaderProps } from './Header.types'

// Resolves the correct logo source from mode and mobile header layout.
function getLogoSource(mode: HeaderMode, isMobile: boolean): string {
  if (isMobile) {
    return logoMobile
  }

  return mode === 'dark' ? logoLight : logoDark
}

// Renders a reusable board header for desktop/tablet and compact mobile layouts.
function Header({
  addTaskLabel = '+ Add New Task',
  boardName,
  className,
  isMobile = false,
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
  const shouldShowLogo = isMobile || !sidebarVisible
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
        {shouldShowLogo ? <div className={styles.logoSlot}><img alt="Kanban" className={styles.logo} src={getLogoSource(mode, isMobile)} /></div> : null}
        <h1 className={classNames(styles.title, isMobile && styles.titleMobile)}>
          <span className={styles.titleText}>{boardName}</span>
          {isMobile ? <img alt="" aria-hidden="true" className={styles.boardChevron} src={iconChevronDown} /> : null}
        </h1>
      </div>

      <div className={styles.actions}>
        <Button
          aria-label={isMobile ? addTaskLabel : undefined}
          className={classNames(styles.addTaskButton, isMobile && styles.addTaskButtonMobile)}
          disabled={isAddTaskDisabled}
          onClick={onAddTask}
          size="large"
          variant="primary"
        >
          {isMobile ? <img alt="" aria-hidden="true" className={styles.addTaskMobileIcon} src={iconAddTaskMobile} /> : addTaskLabel}
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
