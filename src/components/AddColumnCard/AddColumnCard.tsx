import { classNames } from '../../utils'
import styles from './AddColumnCard.module.css'
import type { AddColumnCardProps } from './AddColumnCard.types'

// Renders the reusable add-column gradient lane card for light and dark board canvases.
function AddColumnCard({ className, label = '+ New Column', mode = 'light', type = 'button', ...props }: AddColumnCardProps) {
  return (
    <button className={classNames(styles.card, mode === 'dark' ? styles.dark : styles.light, className)} type={type} {...props}>
      <span className={styles.label}>{label}</span>
    </button>
  )
}

export default AddColumnCard
