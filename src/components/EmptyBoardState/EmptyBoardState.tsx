import { classNames } from '../../utils'
import { Button } from '../Button'
import styles from './EmptyBoardState.module.css'
import type { EmptyBoardStateProps } from './EmptyBoardState.types'

// Renders the reusable board-empty call to action used in light and dark board canvases.
function EmptyBoardState({
  actionLabel = '+ Add New Column',
  className,
  message = 'This board is empty. Create a new column to get started.',
  mode = 'light',
  onAddColumn,
  ...props
}: EmptyBoardStateProps) {
  return (
    <section className={classNames(styles.root, mode === 'dark' ? styles.dark : styles.light, className)} {...props}>
      <p className={styles.message}>{message}</p>
      <Button className={styles.actionButton} onClick={onAddColumn} size="large" variant="primary">
        {actionLabel}
      </Button>
    </section>
  )
}

export default EmptyBoardState
