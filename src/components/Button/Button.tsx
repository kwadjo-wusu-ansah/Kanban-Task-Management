import { classNames } from '../../utils'
import styles from './Button.module.css'
import type { ButtonProps } from './Button.types'

// Resolves the correct size class from button variant and size props.
function getSizeClassName(variant: NonNullable<ButtonProps['variant']>, size: NonNullable<ButtonProps['size']>): string {
  if (variant === 'primary') {
    return size === 'large' ? styles.primaryLarge : styles.primarySmall
  }

  return styles.compact
}

// Renders a reusable token-driven button with light-mode variants.
function Button({ className, size = 'large', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={classNames(styles.button, styles[variant], getSizeClassName(variant, size), className)} type={type} {...props} />
  )
}

export default Button
