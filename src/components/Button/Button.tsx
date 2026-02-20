import { classNames } from '../../utils'
import styles from './Button.module.css'
import type { ButtonProps } from './Button.types'

// Resolves the correct variant class for light or dark button mode.
function getVariantClassName(variant: NonNullable<ButtonProps['variant']>, mode: NonNullable<ButtonProps['mode']>): string {
  if (variant === 'secondary') {
    return mode === 'dark' ? styles.secondaryDark : styles.secondaryLight
  }

  return styles[variant]
}

// Resolves the correct size class from button variant and size props.
function getSizeClassName(variant: NonNullable<ButtonProps['variant']>, size: NonNullable<ButtonProps['size']>): string {
  if (variant === 'primary') {
    return size === 'large' ? styles.primaryLarge : styles.primarySmall
  }

  return styles.compact
}

// Renders a reusable token-driven button with light and dark variants.
function Button({ className, mode = 'light', size = 'large', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, getVariantClassName(variant, mode), getSizeClassName(variant, size), className)}
      type={type}
      {...props}
    />
  )
}

export default Button
