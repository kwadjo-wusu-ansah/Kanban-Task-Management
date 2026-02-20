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
  mode = 'light',
  onAddTask,
  onMenuOpen,
  sidebarVisible = true,
  ...props
}: HeaderProps) {
  const shouldShowLogo = !sidebarVisible

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
        <button aria-label="Open board actions" className={styles.menuButton} onClick={onMenuOpen} type="button">
          <img alt="" aria-hidden="true" className={styles.menuIcon} src={iconVerticalEllipsis} />
        </button>
      </div>
    </header>
  )
}

export default Header
