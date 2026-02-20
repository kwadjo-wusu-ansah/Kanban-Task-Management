# Design System

## Purpose
Defines the visual and interaction standards for Kanban UI implementation.
This version is aligned to Figma board screens and the project local `data.json` + `src/assets/` resources.

## Sources of Truth
- Figma references: `node-id: 0:9066` and board-flow nodes `0:8951` through `0:6527`
- Dataset source: `data.json`
- Asset source: `src/assets/` only
- Token source: `src/styles/variables.css`
- Base styles: `src/styles/globals.css`

## Foundation Tokens

### Color
| Token | Hex | Usage |
| --- | --- | --- |
| `--color-primary` | `#635FC7` | Primary actions |
| `--color-primary-hover` | `#A8A4FF` | Primary hover |
| `--color-black` | `#000112` | Main text (light) |
| `--color-very-dark-grey` | `#20212C` | Dark board background |
| `--color-dark-grey` | `#2B2C37` | Dark panel/sidebar/topbar surface |
| `--color-lines-dark` | `#3E3F4E` | Dark borders |
| `--color-medium-grey` | `#828FA3` | Secondary text |
| `--color-lines-light` | `#E4EBFA` | Light borders |
| `--color-light-grey` | `#F4F7FD` | Light board background |
| `--color-white` | `#FFFFFF` | Inverse text/surfaces |
| `--color-red` | `#EA5555` | Error/destructive |
| `--color-red-hover` | `#FF9898` | Destructive hover |

### Typography
| Token | CSS |
| --- | --- |
| Heading XL | `24px / 1 / 700` |
| Heading L | `18px / 1 / 700` |
| Heading M | `15px / 19px / 700` |
| Heading S | `12px / 1 / 700 / 2.4px letter-spacing` |
| Body L | `13px / 23px / 500` |
| Body M | `12px / 1 / 700` |

### Radius and Effects
| Token | Value |
| --- | --- |
| `--radius-2` | `2px` |
| `--radius-4` | `4px` |
| `--radius-6` | `6px` |
| `--radius-8` | `8px` |
| `--radius-20` | `20px` |
| `--radius-24` | `24px` |
| `--shadow-menu` | `0 10px 20px rgba(54, 78, 126, 0.25)` |

## Reusable Component Inventory

### Shell and Navigation
- `AppShell`: shared desktop/mobile shell regions.
- `Sidebar`: board list, create-board action, theme toggle, hide-sidebar action.
- `TopBar`: board title, add-task CTA, and overflow menu trigger.

### Board Rendering
- `BoardColumn`: column header (dot + uppercase title/count) and task stack.
- `TaskCard`: title + subtask progress summary.
- `AddColumnCard`: gradient lane CTA.
- `EmptyBoardState`: centered no-column fallback.

### Overlays and Menus
- `Modal`: backdrop + panel shell for all dialogs.
- `ActionMenu`: popover menu for edit/delete actions.
- `ConfirmDialog`: reusable destructive confirmation content.

### Form Controls
- `TextField`: single-line input with error state.
- `TextAreaField`: multiline description input with error state.
- `SelectField`: status dropdown with chevron icon.
- `InputListField`: dynamic row list (subtasks/columns) with remove actions.
- `SubtaskCheckbox`: checklist row for completed/active subtasks.
- `Button`: primary/secondary/destructive variants with size and light/dark mode support.
- `IconButton`: compact icon action trigger.

## Interaction and State Rules
1. Every control must expose visible hover/focus states.
2. Inputs must use `--color-primary` for active border and `--color-red` for errors.
3. Destructive actions must use `Button` destructive variant or `ActionMenu` danger tone.
4. Dark theme components must use dark surfaces and preserve readable contrast.
5. Modal overlays must dim board content using a semi-transparent backdrop.

## Layout Rules
1. Shell desktop split is sidebar + content; mobile collapses to topbar + content.
2. Board columns are horizontally scrollable lanes with fixed lane width.
3. Modals should use constrained widths (`small`, `medium`, `large`) and centered alignment.
4. Empty board states must remain centered within available board viewport height.

## Asset Rules
1. Use local assets from `src/assets/` only.
2. Import assets through `src/assets/index.ts` only.
3. Do not use external image URLs for icons/logos.
4. Do not recreate existing icon assets in CSS or inline SVG.

## Data Rules
1. Keep `data.json` as canonical board/task source.
2. Derive presentation data in `src/data/` modules.
3. Keep fallback values for empty datasets.

## Accessibility Rules
1. Interactive elements must be keyboard reachable.
2. Decorative icons must use `alt=""` with `aria-hidden="true"`.
3. Buttons that contain only icons must include an `aria-label`.
4. Ensure contrast remains readable in light and dark variants.

## Performance Rules
1. Prefer reusable primitives over repeated markup.
2. Keep state local to the feature region where possible.
3. Use typed props and direct render paths to avoid unnecessary mapping logic in view files.
4. Keep style recalculation small by using scoped CSS Modules.

## Update Policy
- Update this file whenever tokens, component inventory, interaction states, or layout rules change.
