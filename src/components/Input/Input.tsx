import { useState } from 'react'
import { iconCheck, iconChevronDown } from '../../assets'
import { classNames } from '../../utils'
import styles from './Input.module.css'
import type { CheckboxInputProps, DropdownInputProps, InputProps, TextFieldInputProps } from './Input.types'
import {
  getCheckboxStateClassName,
  getDropdownStateClassName,
  getModeClassName,
  getTextFieldStateClassName,
  resolveCheckboxCheckedValue,
  resolveDropdownDisplayValue,
} from './Input.utils'

// Renders checkbox input rows with mode-aware idle, hover, and active visuals.
function renderCheckboxInput({
  checkboxLabel,
  checked,
  className,
  id,
  mode = 'dark',
  name,
  onCheckboxChange,
  state = 'idle',
}: CheckboxInputProps) {
  const isChecked = resolveCheckboxCheckedValue(checked, state)

  return (
    <label className={classNames(styles.root, getModeClassName(mode, styles), styles.checkboxControl, getCheckboxStateClassName(state, isChecked, styles), className)}>
      <input
        checked={isChecked}
        className={styles.checkboxNative}
        id={id}
        name={name}
        onChange={onCheckboxChange}
        readOnly={typeof checked === 'boolean' && !onCheckboxChange}
        type="checkbox"
      />
      <span className={classNames(styles.checkboxBox, isChecked && styles.checkboxBoxChecked)}>
        {isChecked ? <img alt="" aria-hidden="true" className={styles.checkboxCheckIcon} src={iconCheck} /> : null}
      </span>
      <span className={classNames(styles.checkboxText, isChecked && styles.checkboxTextCompleted)}>{checkboxLabel}</span>
    </label>
  )
}

// Renders text field rows with mode-aware idle, active, and error visuals.
function renderTextFieldInput({
  className,
  errorMessage,
  fieldLabel,
  id,
  mode = 'dark',
  name,
  onTextChange,
  placeholder,
  state = 'idle',
  value,
}: TextFieldInputProps) {
  const hasError = state === 'error' && Boolean(errorMessage)
  const errorElementId = hasError ? `${name ?? id ?? 'input'}-error` : undefined

  return (
    <div className={classNames(styles.root, getModeClassName(mode, styles), styles.fieldGroup, className)}>
      {fieldLabel ? <span className={styles.fieldLabel}>{fieldLabel}</span> : null}
      <div className={styles.textFieldWrap}>
        <input
          aria-describedby={errorElementId}
          aria-invalid={hasError || undefined}
          className={classNames(styles.textFieldControl, getTextFieldStateClassName(state, styles))}
          id={id}
          name={name}
          onChange={onTextChange}
          placeholder={placeholder}
          readOnly={value !== undefined && !onTextChange}
          type="text"
          value={value}
        />
        {hasError ? (
          <span className={styles.textFieldErrorMessage} id={errorElementId}>
            {errorMessage}
          </span>
        ) : null}
      </div>
    </div>
  )
}

// Renders dropdown rows with mode-aware idle, active, and menu-open visuals.
function renderDropdownInput({
  className,
  dropdownLabel,
  isMenuOpen = false,
  mode = 'dark',
  onDropdownSelect,
  onDropdownToggle,
  options,
  state = 'idle',
  value,
}: DropdownInputProps) {
  const selectedLabel = resolveDropdownDisplayValue(value, options)

  return (
    <div className={classNames(styles.root, getModeClassName(mode, styles), styles.fieldGroup, className)}>
      {dropdownLabel ? <span className={styles.fieldLabel}>{dropdownLabel}</span> : null}
      <div className={styles.dropdownWrap}>
        <button
          aria-expanded={isMenuOpen}
          aria-haspopup="listbox"
          className={classNames(styles.dropdownControl, getDropdownStateClassName(state, styles))}
          onClick={onDropdownToggle}
          type="button"
        >
          <span className={styles.dropdownValue}>{selectedLabel}</span>
          <img alt="" aria-hidden="true" className={styles.dropdownChevronIcon} src={iconChevronDown} />
        </button>
        {isMenuOpen ? (
          <ul className={styles.dropdownMenu} role="listbox">
            {options.map((option) => (
              <li className={styles.dropdownMenuOption} key={option.value} role="option">
                <button className={styles.dropdownOptionButton} onClick={() => onDropdownSelect?.(option.value)} type="button">
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

// Renders a unified input primitive for checkbox, text field, and dropdown controls.
function Input(props: InputProps) {
  const [uncontrolledCheckboxChecked, setUncontrolledCheckboxChecked] = useState(false)

  if (props.variant === 'checkbox') {
    const isControlled = typeof props.checked === 'boolean'
    const resolvedChecked = isControlled ? props.checked : props.state === 'active' || uncontrolledCheckboxChecked

    const handleCheckboxChange: CheckboxInputProps['onCheckboxChange'] = (event) => {
      if (!isControlled) {
        setUncontrolledCheckboxChecked(event.target.checked)
      }

      props.onCheckboxChange?.(event)
    }

    const resolvedCheckboxChangeHandler =
      !isControlled || props.onCheckboxChange ? handleCheckboxChange : props.onCheckboxChange

    return renderCheckboxInput({
      ...props,
      checked: resolvedChecked,
      onCheckboxChange: resolvedCheckboxChangeHandler,
    })
  }

  if (props.variant === 'textField') {
    return renderTextFieldInput(props)
  }

  return renderDropdownInput(props)
}

export default Input
