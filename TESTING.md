# Testing Documentation for Daily Mood Tracker Application

## Overview

This document provides comprehensive information about the test suite for the Daily Mood Tracker Application. The application uses a full-stack architecture with React frontend, Node.js/Express backend, and MongoDB database.

## Testing Strategy

### Test Types

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test API endpoints and database interactions
3. **Component Tests**: Test React components with user interactions
4. **Hook Tests**: Test custom React hooks
5. **Utility Tests**: Test helper functions and utilities

### Testing Stack

- **Frontend**: Jest + React Testing Library + TypeScript
- **Backend**: Jest + Supertest + MongoDB Memory Server
- **Coverage**: Jest Coverage Reports
- **Mocking**: Jest Mocks for external dependencies

## Test Structure

```
├── src/
│   ├── utils/
│   │   ├── moodAnalytics.test.ts      # Mood analytics utility tests
│   │   └── dateUtils.test.ts          # Date utility tests
│   ├── api/
│   │   └── entriesApi.test.ts         # API layer tests
│   ├── hooks/
│   │   └── useMoodData.test.ts        # Custom hook tests
│   ├── components/
│   │   └── MoodEntry/
│   │       └── MoodEntry.test.tsx     # Component tests
│   └── test/
│       ├── setup.ts                   # Global test setup
│       └── teardown.ts                # Global test teardown
├── server/
│   └── test/
│       └── entries.test.js            # Backend API tests
├── jest.config.js                     # Jest configuration
└── TESTING.md                         # This documentation
```

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

2. Set up test environment variables:
   ```bash
   # Create .env.test file
   MONGO_URI=mongodb://localhost:27017/moodtracker-test
   JWT_SECRET=test-secret
   ```

### Running All Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Running Specific Test Suites

```bash
# Run only frontend tests
npm test -- --testPathPattern=src

# Run only backend tests
npm test -- --testPathPattern=server

# Run specific test file
npm test -- --testPathPattern=moodAnalytics

# Run tests matching a pattern
npm test -- --testNamePattern="should calculate"
```

### Running Tests in CI/CD

```bash
# Run tests with coverage and exit
npm run test:ci

# Run tests with verbose output
npm test -- --verbose
```

## Test Coverage

### Coverage Targets

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Reports

After running tests with coverage, you can find reports in:
- `coverage/lcov-report/index.html` - HTML coverage report
- `coverage/lcov.info` - LCOV format for CI tools

## Test Categories

### 1. Utility Tests (`src/utils/`)

#### moodAnalytics.test.ts
Tests the mood analytics utility functions:

- **calculateMoodAnalytics()**: Tests mood calculation, distribution, trends
- **calculateStreakDays()**: Tests consecutive day streak calculation
- **generateChartData()**: Tests chart data generation for visualizations
- **generateWeeklyReport()**: Tests weekly report generation
- **generateMonthlyReport()**: Tests monthly report generation

**Key Test Scenarios**:
- Empty entries handling
- Single entry calculations
- Multiple entries with different moods
- Mood trend detection (improving/declining/stable)
- Streak calculation with gaps
- Chart data generation for various time periods

#### dateUtils.test.ts
Tests date utility functions:

- **formatDate()**: Tests date formatting
- **formatDateDisplay()**: Tests human-readable date formatting
- **getWeekRange()**: Tests week range calculations
- **getMonthRange()**: Tests month range calculations
- **getLastNDays()**: Tests date range generation
- **isToday()**: Tests today date detection
- **getRelativeDate()**: Tests relative date formatting

**Key Test Scenarios**:
- Different date formats
- Leap year handling
- Month boundary calculations
- Relative date detection (Today, Yesterday)

### 2. API Tests (`src/api/`)

#### entriesApi.test.ts
Tests the API layer functions:

- **getEntries()**: Tests fetching all entries
- **getEntriesByDate()**: Tests date-filtered entries
- **addEntry()**: Tests creating new entries
- **updateEntry()**: Tests updating existing entries
- **deleteEntry()**: Tests deleting entries

**Key Test Scenarios**:
- Successful API calls
- Error handling for network failures
- Authentication header management
- Request/response validation
- Different HTTP status codes

### 3. Hook Tests (`src/hooks/`)

#### useMoodData.test.ts
Tests the custom useMoodData hook:

- **Initial state and data fetching**: Tests loading states and data retrieval
- **CRUD operations**: Tests add, update, delete operations
- **Filtering and querying**: Tests entry filtering by date, mood, search
- **Analytics and chart data**: Tests analytics calculations
- **Data export and import**: Tests data import/export functionality
- **Error handling**: Tests error states and recovery

**Key Test Scenarios**:
- Hook initialization
- Data fetching on mount
- State updates after operations
- Filter combinations
- Export/import data validation
- Error boundary handling

### 4. Component Tests (`src/components/`)

#### MoodEntry.test.tsx
Tests the MoodEntry component:

- **Rendering**: Tests component rendering and form elements
- **Form submission**: Tests form validation and submission
- **User interactions**: Tests user input and form updates
- **Validation**: Tests form validation rules
- **Error handling**: Tests error states and messages
- **Accessibility**: Tests keyboard navigation and ARIA attributes

**Key Test Scenarios**:
- Form field rendering
- Mood selection
- Date and intensity input
- Note validation (length, content)
- Success/error message display
- Form reset after submission
- Keyboard navigation

### 5. Backend API Tests (`server/test/`)

#### entries.test.js
Tests the Express.js API endpoints:

- **GET /api/entries**: Tests entry retrieval with authentication
- **POST /api/entries**: Tests entry creation
- **PUT /api/entries/:id**: Tests entry updates
- **DELETE /api/entries/:id**: Tests entry deletion
- **Authorization**: Tests user role-based access control

**Key Test Scenarios**:
- Authentication requirements
- User authorization (own entries vs admin access)
- Data validation
- Database operations
- Error responses
- Date filtering
- User-specific data isolation

## Mocking Strategy

### Frontend Mocks

1. **API Calls**: Mock axios requests
2. **Local Storage**: Mock browser storage
3. **Date/Time**: Mock Date constructor for consistent testing
4. **React Context**: Mock AuthContext and MoodDataContext
5. **Browser APIs**: Mock URL, document, window APIs

### Backend Mocks

1. **Database**: Use MongoDB Memory Server for tests
2. **JWT**: Mock JWT verification
3. **Environment Variables**: Mock process.env
4. **File System**: Mock file operations

## Test Data

### Sample Data Files

- `sample-mood-data.json`: Sample mood entries for testing
- `sample-export-with-users.json`: Sample export data with user information

### Test Data Generation

```javascript
// Example test data structure
const mockEntry = {
  _id: 'test-id',
  mood: 'happy',
  note: 'Test entry',
  date: '2024-01-15',
  timestamp: 1705312800000,
  intensity: 8,
  tags: ['test']
};
```

## Best Practices

### Writing Tests

1. **Arrange-Act-Assert**: Structure tests with clear sections
2. **Descriptive Names**: Use descriptive test names that explain the scenario
3. **Single Responsibility**: Each test should test one specific behavior
4. **Clean Setup/Teardown**: Ensure tests don't affect each other
5. **Mock External Dependencies**: Don't test external services

### Test Organization

1. **Group Related Tests**: Use describe blocks to group related tests
2. **Nested Descriptions**: Use nested describes for complex scenarios
3. **Consistent Naming**: Use consistent naming conventions
4. **Test Isolation**: Ensure tests can run independently

### Performance

1. **Fast Execution**: Keep tests fast and efficient
2. **Minimal Setup**: Minimize setup time for each test
3. **Parallel Execution**: Enable parallel test execution where possible
4. **Resource Cleanup**: Clean up resources after tests

## Debugging Tests

### Common Issues

1. **Async/Await**: Ensure proper async/await usage
2. **Mock Cleanup**: Clear mocks between tests
3. **State Isolation**: Ensure tests don't share state
4. **Timing Issues**: Use waitFor for async operations

### Debug Commands

```bash
# Run single test with debugging
npm test -- --testNamePattern="should add entry" --verbose

# Run tests with console output
npm test -- --verbose --no-coverage

# Debug specific test file
npm test -- --testPathPattern=MoodEntry.test.tsx --verbose
```

## Continuous Integration

### GitHub Actions

The test suite is configured to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npm run test:ci
    npm run test:coverage
```

### Coverage Reporting

Coverage reports are generated and can be integrated with:
- Codecov
- Coveralls
- GitHub Actions
- SonarQube

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Keep testing libraries updated
2. **Review Coverage**: Monitor test coverage metrics
3. **Refactor Tests**: Refactor tests when code changes
4. **Add New Tests**: Add tests for new features
5. **Remove Obsolete Tests**: Remove tests for removed features

### Test Review Checklist

- [ ] All new features have tests
- [ ] Tests cover edge cases
- [ ] Tests are fast and reliable
- [ ] Coverage meets targets
- [ ] Tests follow naming conventions
- [ ] Mocks are properly configured
- [ ] Error scenarios are tested

## Troubleshooting

### Common Problems

1. **Test Timeouts**: Increase timeout for slow tests
2. **Mock Issues**: Ensure mocks are properly configured
3. **Async Problems**: Use proper async/await patterns
4. **Environment Issues**: Check environment variables

### Getting Help

1. Check the Jest documentation
2. Review React Testing Library guides
3. Check existing test examples in the codebase
4. Consult the team for complex testing scenarios

## Conclusion

This comprehensive test suite ensures the reliability and maintainability of the Daily Mood Tracker Application. Regular testing helps catch bugs early and provides confidence when making changes to the codebase.

For questions or improvements to the testing strategy, please consult the development team or update this documentation accordingly. 