import {
  addOrMergeParams,
  groupParamsByKey,
  paramsReducer,
  removeParams,
} from './utils';

describe('groupParamsByKey', () => {
  test('should group single value parameters correctly', () => {
    const params = new URLSearchParams('foo=1&bar=2');
    const result = groupParamsByKey(params);
    expect(result).toEqual({ foo: '1', bar: '2' });
  });

  test('should handle multiple values for the same key', () => {
    const params = new URLSearchParams('foo=1,2&bar=3');
    const result = groupParamsByKey(params);
    expect(result).toEqual({ foo: '1,2', bar: '3' });
  });

  test('should handle empty parameters', () => {
    const params = new URLSearchParams('');
    const result = groupParamsByKey(params);
    expect(result).toEqual({});
  });

  test('should handle multiple different keys', () => {
    const params = new URLSearchParams('foo=1&bar=2&baz=3');
    const result = groupParamsByKey(params);
    expect(result).toEqual({ foo: '1', bar: '2', baz: '3' });
  });

  test('should store repeated keys in an array', () => {
    const params = new URLSearchParams('foo=1&foo=2&bar=3');
    const result = groupParamsByKey(params);
    expect(result).toEqual({ foo: ['1', '2'], bar: '3' });
  });
});

describe('removeParams', () => {
  test('should remove a single parameter', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToRemove = { foo: true };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('bar=2');
  });

  test('should remove a specific value from a comma-separated list', () => {
    const searchParams = new URLSearchParams('foo=1,2,3&bar=4');
    const paramsToRemove = { foo: '2' };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('foo=1%2C3&bar=4');
  });

  test('should remove multiple parameters', () => {
    const searchParams = new URLSearchParams('foo=1,2&bar=3&baz=4');
    const paramsToRemove = { foo: '1', bar: true };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('foo=2&baz=4');
  });

  test('should handle parameters that are not present', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToRemove = { baz: true };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('foo=1&bar=2');
  });

  test('should handle empty URLSearchParams', () => {
    const searchParams = new URLSearchParams('');
    const paramsToRemove = { foo: true };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('');
  });

  test('should handle empty params to remove', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToRemove = {};
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('foo=1&bar=2');
  });

  test('should remove the entire key if the value is not a part of a comma-separated list', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToRemove = { bar: true };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('foo=1');
  });

  test('should correctly handle a value that appears multiple times in a comma-separated list', () => {
    const searchParams = new URLSearchParams('foo=1,2,2,3&bar=4');
    const paramsToRemove = { foo: '2' };
    const result = removeParams(searchParams, paramsToRemove);
    expect(result.toString()).toBe('foo=1%2C3&bar=4');
  });
});

describe('addOrMergeParams', () => {
  test('should add a new parameter', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToAdd = { baz: '3' };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1&bar=2&baz=3');
  });

  test('should merge a parameter with an existing one', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToAdd = { foo: '3' };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1%2C3&bar=2');
  });

  test('should handle multiple parameters', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToAdd = { foo: '3', baz: '4' };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1%2C3&bar=2&baz=4');
  });

  test('should ignore undefined values', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToAdd = { foo: undefined, baz: '4' };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1&bar=2&baz=4');
  });

  test('should add truthy boolean values as strings', () => {
    const searchParams = new URLSearchParams('foo=1&bar=2');
    const paramsToAdd = { baz: true, qux: true };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1&bar=2&baz=true&qux=true');
  });

  test('should handle empty URLSearchParams', () => {
    const searchParams = new URLSearchParams('');
    const paramsToAdd = { foo: '1', bar: '2' };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1&bar=2');
  });

  test('should append to an existing comma-separated list', () => {
    const searchParams = new URLSearchParams('foo=1,2');
    const paramsToAdd = { foo: '3' };
    const result = addOrMergeParams(searchParams, paramsToAdd);
    expect(result.toString()).toBe('foo=1%2C2%2C3');
  });
});

describe('paramsReducer', () => {
  describe('add action', () => {
    it('should add new parameters', () => {
      const existingParams = new URLSearchParams('auto=format');
      const newParams = { fit: 'crop' };
      const updatedParams = paramsReducer(existingParams, newParams, 'add');
      expect(updatedParams.toString()).toBe('auto=format&fit=crop');
    });

    it('should merge existing parameters', () => {
      const existingParams = new URLSearchParams('auto=format');
      const newParams = { auto: 'format', fit: 'crop' };
      const updatedParams = paramsReducer(existingParams, newParams, 'add');
      expect(updatedParams.toString()).toBe('auto=format&fit=crop');
    });

    it('should handle boolean and undefined values', () => {
      const existingParams = new URLSearchParams('auto=fm');
      const newParams = { fit: 'crop', verbose: true, debug: undefined };
      const updatedParams = paramsReducer(existingParams, newParams, 'add');
      expect(updatedParams.toString()).toBe('auto=fm&fit=crop&verbose=true');
    });
  });

  describe('remove action', () => {
    it('should remove specified parameters', () => {
      const existingParams = new URLSearchParams('auto=format&fit=crop');
      const newParams = { fit: 'crop' };
      const updatedParams = paramsReducer(existingParams, newParams, 'remove');
      expect(updatedParams.toString()).toBe('auto=format');
    });

    it('should handle multiple parameters to remove', () => {
      const existingParams = new URLSearchParams(
        'auto=format&fit=crop&quality=80',
      );
      const newParams = { fit: 'crop', quality: '80' };
      const updatedParams = paramsReducer(existingParams, newParams, 'remove');
      expect(updatedParams.toString()).toBe('auto=format');
    });

    it('should handle non-existing parameters gracefully', () => {
      const existingParams = new URLSearchParams('auto=format&fit=crop');
      const newParams = { quality: '80' };
      const updatedParams = paramsReducer(existingParams, newParams, 'remove');
      expect(updatedParams.toString()).toBe('auto=format&fit=crop');
    });
  });
});
