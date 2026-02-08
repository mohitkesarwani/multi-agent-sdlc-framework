# Backend Tests

This directory contains tests for the backend API.

## Test Structure

- **unit/**: Unit tests for individual functions and classes
- **integration/**: Integration tests for API endpoints and database interactions
- **e2e/**: End-to-end tests for complete user workflows

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- unit
npm test -- integration
npm test -- e2e

# Run with coverage
npm test -- --coverage
```

## Writing Tests

- Follow the existing test patterns in each directory
- Use descriptive test names
- Mock external dependencies in unit tests
- Use test database for integration tests
- Clean up test data after each test

## Test Requirements

- All new features must have unit tests
- Critical paths must have integration tests
- User workflows should have e2e tests
