import { classNames } from '../../utils'
import styles from './Button.module.css'
import type { ButtonProps } from './Button.types'
import { getSizeClassName, getVariantClassName } from './Button.utils'

// Renders a reusable token-driven button with light and dark variants.
function Button({ className, mode = 'light', size = 'large', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.button,
        getVariantClassName(variant, mode, styles),
        getSizeClassName(variant, size, styles),
        className,
      )}
      type={type}
      {...props}
    />
  )
}

export default Button
