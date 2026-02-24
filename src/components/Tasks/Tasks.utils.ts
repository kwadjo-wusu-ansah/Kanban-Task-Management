// Formats the column title label that appears in the tasks group heading.
export function formatHeadingLabel(heading: string, taskCount: number): string {
  const trimmedHeading = heading.trim()
  const safeHeading = trimmedHeading.length > 0 ? trimmedHeading : 'Untitled'
  const safeTaskCount = Math.max(0, taskCount)

  return `${safeHeading.toUpperCase()} (${safeTaskCount})`
}
