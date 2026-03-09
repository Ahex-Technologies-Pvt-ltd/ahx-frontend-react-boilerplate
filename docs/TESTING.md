# Testing Guide

This project uses Jest with React Testing Library for unit and integration testing.

## Testing Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - React component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@swc/jest** - Fast TypeScript transformation
- **jsdom** - DOM implementation for Node.js

## Configuration

### jest.config.ts
- Test environment: jsdom
- Path aliases: `@/` → `src/`
- CSS/Image mocking configured
- Coverage collection from `src/**/*.{ts,tsx}`

### Setup Files
- `src/test/setup.ts` - Global test setup
- `src/test/__mocks__/fileMock.ts` - Mock for static assets
- `src/test/test-utils.tsx` - Custom render utilities

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test File Structure

```
src/
├── __tests__/              # Component tests
│   └── App.test.tsx
├── lib/
│   └── __tests__/          # Utility tests
│       └── utils.test.ts
└── test/
    ├── setup.ts            # Global setup
    ├── test-utils.tsx      # Custom utilities
    └── __mocks__/          # Mock files
        └── fileMock.ts
```

## Writing Tests

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
    it('should render correctly', () => {
        render(<MyComponent />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should handle user interaction', async () => {
        const user = userEvent.setup();
        render(<MyComponent />);
        
        const button = screen.getByRole('button');
        await user.click(button);
        
        expect(button).toHaveTextContent('Clicked');
    });
});
```

### Utility Function Test

```typescript
import { myUtility } from '../utils';

describe('myUtility', () => {
    it('should return expected value', () => {
        const result = myUtility('input');
        expect(result).toBe('expected');
    });
});
```

### Using Custom Test Utils

```typescript
// Import from test-utils instead of @testing-library/react
import { render, screen } from '@/test/test-utils';

// This allows you to add custom providers in the future
```

## Best Practices

1. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

2. **Test user behavior, not implementation**
   ```typescript
   // ✅ Good - tests behavior
   await user.click(screen.getByRole('button', { name: /submit/i }));
   expect(screen.getByText('Success')).toBeInTheDocument();
   
   // ❌ Bad - tests implementation
   expect(component.state.isSubmitted).toBe(true);
   ```

3. **Use userEvent over fireEvent**
   ```typescript
   // ✅ Good - simulates real user interaction
   const user = userEvent.setup();
   await user.click(button);
   
   // ❌ Bad - lower level, less realistic
   fireEvent.click(button);
   ```

4. **Clean test descriptions**
   ```typescript
   // ✅ Good
   it('should display error message when form is invalid', () => {});
   
   // ❌ Bad
   it('test 1', () => {});
   ```

5. **Arrange-Act-Assert pattern**
   ```typescript
   it('should increment counter', async () => {
       // Arrange
       const user = userEvent.setup();
       render(<Counter />);
       
       // Act
       await user.click(screen.getByRole('button'));
       
       // Assert
       expect(screen.getByText('Count: 1')).toBeInTheDocument();
   });
   ```

## Coverage

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/coverage-final.json` - JSON report

Target coverage thresholds (configure in jest.config.ts):
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Common Matchers

```typescript
// DOM matchers (from @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveAttribute('href', '/path');
expect(element).toHaveClass('className');
expect(element).toBeDisabled();
expect(element).toBeEnabled();

// Standard Jest matchers
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(array).toContain(item);
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg);
```

## Debugging Tests

```typescript
// Print DOM structure
import { screen } from '@testing-library/react';
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Use logRoles to see available roles
import { logRoles } from '@testing-library/react';
const { container } = render(<MyComponent />);
logRoles(container);
```

## Mocking

### Mock modules
```typescript
jest.mock('../api', () => ({
    fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' })),
}));
```

### Mock functions
```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
