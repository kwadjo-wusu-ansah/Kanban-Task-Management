import {
  iconDarkTheme,
  iconHideSidebar,
  iconLightTheme,
  iconShowSidebar,
  logoDark,
  logoLight,
} from '../../assets'
import { classNames } from '../../utils'
import styles from './Sidebar.module.css'
import type { SidebarProps } from './Sidebar.types'
import { getBoardCount, getBoardIconSource } from './Sidebar.utils'

// Renders desktop sidebar and mobile board-switcher surfaces for light and dark themes.
function Sidebar({
  activeBoardId,
  boardCount,
  boards,
  className,
  hidden = false,
  isMobile = false,
  mobileMenuOpen = false,
  mode = 'light',
  onBoardSelect,
  onCreateBoard,
  onHideSidebar,
  onLogoClick,
  onMobileMenuClose,
  onShowSidebar,
  onThemeToggle,
  theme = 'light',
}: SidebarProps) {
  const resolvedBoardCount = getBoardCount(boardCount, boards)
  const logoSource = mode === 'dark' ? logoLight : logoDark
  const isDarkTheme = theme === 'dark'

  if (isMobile) {
    if (!mobileMenuOpen) {
      return null
    }

    return (
      <div
        className={classNames(styles.mobileBackdrop, mode === 'dark' ? styles.mobileBackdropDark : styles.mobileBackdropLight)}
        onClick={onMobileMenuClose}
      >
        <aside
          className={classNames(styles.mobileSheet, mode === 'dark' ? styles.dark : styles.light)}
          onClick={(event) => event.stopPropagation()}
        >
          <section className={styles.mobileBoardsGroup}>
            <span className={styles.boardsLabel}>ALL BOARDS ({resolvedBoardCount})</span>
            <ul className={styles.boardsList}>
              {boards.map((board) => {
                const isActive = board.id === activeBoardId

                return (
                  <li key={board.id}>
                    <button
                      className={classNames(styles.boardItemButton, isActive && styles.boardItemActive)}
                      onClick={() => onBoardSelect?.(board.id)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" className={styles.boardIcon} src={getBoardIconSource(isActive, false)} />
                      <span className={styles.boardName}>{board.name}</span>
                    </button>
                  </li>
                )
              })}
              <li>
                <button className={classNames(styles.boardItemButton, styles.createBoardButton)} onClick={onCreateBoard} type="button">
                  <img alt="" aria-hidden="true" className={styles.boardIcon} src={getBoardIconSource(false, true)} />
                  <span className={styles.boardName}>+ Create New Board</span>
                </button>
              </li>
            </ul>
          </section>

          <div className={classNames(styles.mobileThemeToggle, mode === 'dark' ? styles.themeToggleDark : styles.themeToggleLight)}>
            <img alt="" aria-hidden="true" className={styles.themeIcon} src={iconLightTheme} />
            <button aria-label="Toggle theme" className={styles.themeSwitch} onClick={onThemeToggle} type="button">
              <span className={classNames(styles.themeSwitchThumb, isDarkTheme && styles.themeSwitchThumbDark)} />
            </button>
            <img alt="" aria-hidden="true" className={styles.themeIcon} src={iconDarkTheme} />
          </div>
        </aside>
      </div>
    )
  }

  if (hidden) {
    return (
      <button aria-label="Show sidebar" className={styles.showButton} onClick={onShowSidebar} type="button">
        <img alt="" aria-hidden="true" className={styles.showIcon} src={iconShowSidebar} />
      </button>
    )
  }

  return (
    <aside className={classNames(styles.sidebar, mode === 'dark' ? styles.dark : styles.light, className)}>
      {onLogoClick ? (
        <button aria-label="Go to dashboard" className={styles.logoButton} onClick={onLogoClick} type="button">
          <img alt="Kanban" className={styles.logo} src={logoSource} />
        </button>
      ) : (
        <img alt="Kanban" className={styles.logo} src={logoSource} />
      )}

      <section className={styles.boardsGroup}>
        <span className={styles.boardsLabel}>ALL BOARDS ({resolvedBoardCount})</span>
        <ul className={styles.boardsList}>
          {boards.map((board) => {
            const isActive = board.id === activeBoardId

            return (
              <li key={board.id}>
                <button
                  className={classNames(styles.boardItemButton, isActive && styles.boardItemActive)}
                  onClick={() => onBoardSelect?.(board.id)}
                  type="button"
                >
                  <img alt="" aria-hidden="true" className={styles.boardIcon} src={getBoardIconSource(isActive, false)} />
                  <span className={styles.boardName}>{board.name}</span>
                </button>
              </li>
            )
          })}
          <li>
            <button className={classNames(styles.boardItemButton, styles.createBoardButton)} onClick={onCreateBoard} type="button">
              <img alt="" aria-hidden="true" className={styles.boardIcon} src={getBoardIconSource(false, true)} />
              <span className={styles.boardName}>+ Create New Board</span>
            </button>
          </li>
        </ul>
      </section>

      <div className={styles.bottomSection}>
        <div className={classNames(styles.themeToggle, mode === 'dark' ? styles.themeToggleDark : styles.themeToggleLight)}>
          <img alt="" aria-hidden="true" className={styles.themeIcon} src={iconLightTheme} />
          <button aria-label="Toggle theme" className={styles.themeSwitch} onClick={onThemeToggle} type="button">
            <span className={classNames(styles.themeSwitchThumb, isDarkTheme && styles.themeSwitchThumbDark)} />
          </button>
          <img alt="" aria-hidden="true" className={styles.themeIcon} src={iconDarkTheme} />
        </div>

        <button className={styles.hideButton} onClick={onHideSidebar} type="button">
          <img alt="" aria-hidden="true" className={styles.hideIcon} src={iconHideSidebar} />
          <span>Hide Sidebar</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
