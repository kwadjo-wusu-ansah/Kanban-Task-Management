import type { ButtonProps } from './Button.types'

type ButtonStyles = Record<string, string>

// Resolves the correct variant class for light or dark button mode.
export function getVariantClassName(
  variant: NonNullable<ButtonProps['variant']>,
  mode: NonNullable<ButtonProps['mode']>,
  buttonStyles: ButtonStyles,
): string {
  if (variant === 'secondary') {
    return mode === 'dark' ? buttonStyles.secondaryDark : buttonStyles.secondaryLight
  }

  return buttonStyles[variant]
}

// Resolves the correct size class from button variant and size props.
export function getSizeClassName(
  variant: NonNullable<ButtonProps['variant']>,
  size: NonNullable<ButtonProps['size']>,
  buttonStyles: ButtonStyles,
): string {
  if (variant === 'primary') {
    return size === 'large' ? buttonStyles.primaryLarge : buttonStyles.primarySmall
  }

  return buttonStyles.compact
}
