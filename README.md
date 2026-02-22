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

## Testing Structure

- Shared test setup file: `src/test/setup.ts`
- Test naming convention: `*.test.ts` and `*.test.tsx`
- Preferred query strategy: role/label/text-based queries over implementation details

Task 1 config keeps `passWithNoTests: true` so test scripts run before Task 2 test files are added.
