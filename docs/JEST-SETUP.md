# Jest + React Testing Library Setup

Successfully replaced Vitest with Jest for testing.

## Installed Packages

### Core Testing
- `jest` - Test runner and framework
- `@types/jest` - TypeScript types for Jest
- `jest-environment-jsdom` - DOM environment for testing React components
- `ts-jest` - TypeScript support for Jest
- `@swc/jest` - Fast TypeScript/JSX transformation

### React Testing
- `@testing-library/react` - React component testing utilities
- `@testing-library/dom` - DOM testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation

### Utilities
- `identity-obj-proxy` - Mock CSS modules
- `jsdom` - JavaScript DOM implementation

## Configuration Files

### jest.config.ts
Main Jest configuration with:
- TypeScript support via @swc/jest
- jsdom environment
- Path aliases (@/ → src/)
- CSS and image mocking
- Coverage configuration

### src/test/setup.ts
Global test setup that imports jest-dom matchers

### src/test/__mocks__/fileMock.ts
Mock for static assets (images, SVGs, etc.)

### src/test/test-utils.tsx
Custom render utilities for adding providers

## Test Scripts

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Test Examples

### Component Test
`src/__tests__/App.test.tsx` - Tests the main App component with user interactions

### Utility Test
`src/lib/__tests__/utils.test.ts` - Tests the cn() utility function

## Coverage

Current coverage: 100% across all metrics
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

Coverage reports generated in `coverage/` directory (gitignored)

## Key Differences from Vitest

1. **Import statements**: No need to import `describe`, `it`, `expect` - they're global
2. **Configuration**: Uses `jest.config.ts` instead of `vitest.config.ts`
3. **Transform**: Uses `@swc/jest` for fast TypeScript compilation
4. **Matchers**: `@testing-library/jest-dom` imported in setup file

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

## Next Steps

1. Add more test files as you create components
2. Configure coverage thresholds in jest.config.ts if needed
3. Add test scripts to pre-commit hooks if desired
4. Consider adding snapshot testing for UI components
