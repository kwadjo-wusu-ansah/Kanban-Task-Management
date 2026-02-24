import type {
  CheckboxInputProps,
  DropdownInputProps,
  DropdownOption,
  InputMode,
  TextFieldInputProps,
} from './Input.types'

type InputStyles = Record<string, string>

// Chooses dropdown menu placement from available viewport space around the trigger.
export function getDropdownMenuPlacement(triggerRect: DOMRect, optionCount: number): 'bottom' | 'top' {
  const estimatedMenuHeight = optionCount * 31 + 32
  const availableSpaceBelow = window.innerHeight - triggerRect.bottom
  const availableSpaceAbove = triggerRect.top

  if (availableSpaceBelow < estimatedMenuHeight && availableSpaceAbove > availableSpaceBelow) {
    return 'top'
  }

  return 'bottom'
}

// Resolves the mode class used to theme input surfaces.
export function getModeClassName(mode: InputMode, inputStyles: InputStyles): string {
  return mode === 'light' ? inputStyles.lightMode : inputStyles.darkMode
}

// Resolves the checkbox container class from explicit state and checked status.
export function getCheckboxStateClassName(
  state: CheckboxInputProps['state'],
  isChecked: boolean,
  inputStyles: InputStyles,
): string {
  if (isChecked) {
    return inputStyles.checkboxActive
  }

  if (state === 'hover') {
    return inputStyles.checkboxHover
  }

  return inputStyles.checkboxIdle
}

// Resolves the text field border class for idle, active, and error states.
export function getTextFieldStateClassName(state: TextFieldInputProps['state'], inputStyles: InputStyles): string {
  if (state === 'error') {
    return inputStyles.textFieldError
  }

  if (state === 'active') {
    return inputStyles.textFieldActive
  }

  return inputStyles.textFieldIdle
}

// Resolves dropdown border class for idle and active states.
export function getDropdownStateClassName(state: DropdownInputProps['state'], inputStyles: InputStyles): string {
  if (state === 'active') {
    return inputStyles.dropdownActive
  }

  return inputStyles.dropdownIdle
}

// Derives final checkbox checked state from controlled and design-preview state values.
export function resolveCheckboxCheckedValue(checked: boolean | undefined, state: CheckboxInputProps['state']): boolean {
  if (typeof checked === 'boolean') {
    return checked
  }

  return state === 'active'
}

// Resolves the visible dropdown value label from the selected option value.
export function resolveDropdownDisplayValue(value: string, options: DropdownOption[]): string {
  const matchedOption = options.find((option) => option.value === value)

  return matchedOption?.label ?? value
}
