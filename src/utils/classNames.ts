export type ClassValue = string | false | null | undefined

// Builds a normalized class string from optional and conditional class values.
export function classNames(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
