import type { ChangeEventHandler, MouseEventHandler } from 'react'

export type InputVariant = 'checkbox' | 'textField' | 'dropdown'
export type InputMode = 'light' | 'dark'

export type CheckboxState = 'idle' | 'hover' | 'active'
export type TextFieldState = 'idle' | 'active' | 'error'
export type DropdownState = 'idle' | 'active'

export interface DropdownOption {
  label: string
  value: string
}

interface BaseInputProps {
  className?: string
  mode?: InputMode
}

export interface CheckboxInputProps extends BaseInputProps {
  checked?: boolean
  checkboxLabel: string
  id?: string
  name?: string
  onCheckboxChange?: ChangeEventHandler<HTMLInputElement>
  state?: CheckboxState
  variant: 'checkbox'
}

export interface TextFieldInputProps extends BaseInputProps {
  errorMessage?: string
  fieldLabel?: string
  id?: string
  name?: string
  onTextChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  state?: TextFieldState
  value?: string
  variant: 'textField'
}

export interface DropdownInputProps extends BaseInputProps {
  dropdownLabel?: string
  isMenuOpen?: boolean
  onDropdownSelect?: (nextValue: string) => void
  onDropdownToggle?: MouseEventHandler<HTMLButtonElement>
  options: DropdownOption[]
  state?: DropdownState
  value: string
  variant: 'dropdown'
}

export type InputProps = CheckboxInputProps | TextFieldInputProps | DropdownInputProps
