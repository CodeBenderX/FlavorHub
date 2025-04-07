import dbErrorHandler from '../Helpers/dbErrorHandler';

describe('getErrorMessage', () => {
  test('should return unique error message for MongoDB duplicate key error (code 11000)', () => {
    const mockError = {
      code: 11000,
      message: 'E11000 duplicate key error collection: test.users index: email_1 dup key'
    };

    const result = dbErrorHandler.getErrorMessage(mockError);
    expect(result).toMatch(/Email already exists|Unique field already exists/);
  });

  test('should return custom error message from validation error', () => {
    const mockValidationError = {
      errors: {
        name: {
          message: 'Name is required'
        }
      }
    };

    const result = dbErrorHandler.getErrorMessage(mockValidationError);
    expect(result).toBe('Name is required');
  });

  test('should return "Something went wrong" for unknown error code', () => {
    const unknownError = {
      code: 999
    };

    const result = dbErrorHandler.getErrorMessage(unknownError);
    expect(result).toBe('Something went wrong');
  });
});
