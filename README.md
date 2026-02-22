# Kanban Task Management

Kanban Task Management is a React + TypeScript + Vite app with Redux-managed board state, API-driven data hydration, and reusable UI primitives.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

## Scripts

- `npm run dev`: Run Vite development server.
- `npm run build`: Run TypeScript project build and Vite production build.
- `npm run lint`: Lint the codebase with ESLint.
- `npm run preview`: Preview the production build locally.
- `npm run test`: Run Vitest once.
- `npm run test:watch`: Run Vitest in watch mode.
- `npm run test:coverage`: Run Vitest with coverage reporting.

## Testing Stack

- Test runner: Vitest
- Component testing: React Testing Library
- DOM environment: `jsdom`
- Matchers: `@testing-library/jest-dom`
- Coverage provider: V8 (`@vitest/coverage-v8`)

## Testing Structure

The test suite is organized by feature proximity to keep behavior and tests easy to evolve together.

```text
src/
├── components/
│   ├── Sidebar/Sidebar.test.tsx
│   ├── TaskCard/TaskCard.test.tsx
│   └── Tasks/Tasks.test.tsx
├── pages/
│   ├── BoardView/BoardView.interactions.test.tsx
│   └── Dashboard/Dashboard.test.tsx
└── test/
    ├── setup.ts
    └── renderWithKanbanStore.tsx
```

Conventions:

- Keep tests next to the component/page they validate.
- Use `*.test.ts` and `*.test.tsx` naming.
- Use shared helpers from `src/test/` for provider setup.
- Prefer user-facing queries (`getByRole`, `findByText`, `getByLabelText`) over implementation-detail selectors.

## Coverage Workflow

Run coverage:

```bash
npm run test:coverage
```

Inspect the HTML report:

- Open `coverage/index.html` in a browser.

Coverage config is tuned to focus on executable app logic:

- Includes: `src/**/*.{ts,tsx}`
- Excludes: test files, test utilities, style modules, `src/assets/`, barrel `index.ts` files, and root bootstrapping files

## Current Coverage Priorities

Based on the latest coverage report, the main gaps to target next are:

1. `src/store/slices/kanban.slice.ts` reducer branches and edge-case mutations.
2. Remaining `src/pages/BoardView/BoardView.tsx` modal/status/dnd branches not covered by current interaction tests.
3. `src/components/Input/Input.tsx` dropdown and uncontrolled checkbox edge behavior.
4. Route-level flows not yet directly tested (`Login`, `Admin`, `ProtectedRoute`, `NotFound`).

## Recommended Test Progression

1. Add reducer-level tests for `kanban.slice.ts` actions with focused preloaded states.
2. Add route integration tests for auth guards and redirects.
3. Add targeted interaction tests for remaining modal variants and status changes.
4. Re-run `npm run test:coverage` and track whether uncovered branch sets shrink each milestone.
