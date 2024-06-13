/**
 * Adds or merges specified parameters into a URLSearchParams object.
 *
 * @param {URLSearchParams} searchParams - The URLSearchParams object containing the existing query parameters.
 * @param {Record<string, string | boolean | undefined>} params - An object where each key is a parameter name to add or merge, and each value is the parameter value. If the key already exists, the value is appended to the existing value as a comma-separated list.
 * @returns {URLSearchParams} A new URLSearchParams object with the specified parameters added or merged.
 *
 * @example
 * const searchParams = new URLSearchParams('foo=1&bar=2');
 * const paramsToAdd = { foo: '3', baz: '4' };
 * const result = addOrMergeParams(searchParams, paramsToAdd);
 * console.log(result.toString()); // 'foo=1,3&bar=2&baz=4'
 */
export const addOrMergeParams = (
  searchParams: URLSearchParams,
  params: { [key: string]: string | boolean | undefined },
) => {
  const newSearchParams = new URLSearchParams(searchParams);

  Object.entries(params).forEach(([key, value]) => {
    // don't add the param if the value is undefined
    if (!value) {
      return;
    }
    if (newSearchParams.has(key)) {
      const existingValue = newSearchParams.get(key);

      // don't add param if its a duplicate
      if (existingValue === value) {
        return;
      }

      return newSearchParams.set(key, `${existingValue},${value}`);
    }
    newSearchParams.set(key, String(value));
  });

  return newSearchParams;
};

/**
 * Removes specified parameters from a URLSearchParams object.
 *
 * @param {URLSearchParams} searchParams - The URLSearchParams object containing the query parameters.
 * @param {Record<string, string | boolean | undefined>} params - An object where each key is a parameter name to remove and each value is the parameter value to match for removal. If the value is a part of a comma-separated list, only the matching part is removed.
 * @returns {URLSearchParams} A new URLSearchParams object with the specified parameters removed or filtered out.
 *
 * @example
 * const searchParams = new URLSearchParams('foo=1,2&bar=3');
 * const paramsToRemove = { foo: '2', bar: true };
 * const result = removeParams(searchParams, paramsToRemove);
 * console.log(result.toString()); // 'foo=1'
 */
export const removeParams = (
  searchParams: URLSearchParams,
  params: Record<string, string | boolean | undefined>,
) => {
  const newParams = new URLSearchParams(searchParams);

  Object.entries(params).forEach(([key, value]) => {
    if (newParams.has(key)) {
      const existingValue = newParams.getAll(key)[0];

      // if value is null remove it from the params
      if (!existingValue.includes(',')) {
        return newParams.delete(key);
      }

      // if comma separated list, filter it out
      const filteredValue = existingValue.split(',').filter((v) => {
        return v !== value;
      });
      return newParams.set(key, filteredValue.toString());
    }
  });

  return newParams;
};

/**
 * Groups URL search parameters by their key.
 *
 * This function takes a `URLSearchParams` object and groups the parameters
 * by their key. If a key occurs multiple times, those values are collected
 * into an array. If a key has a single value, it remains a string.
 *
 * @example
 * const params = new URLSearchParams('foo=1,2,3&bar=4&baz=5&baz=6');
 * const groupedParams = groupParamsByKey(params);
 * console.log(groupedParams);
 * // Output: { foo: '1,2,3', bar: '4', baz: ['5', '6'] }
 *
 * @see https://stackoverflow.com/a/52539264
 */
export const groupParamsByKey = (params: URLSearchParams) => {
  const entires = [...params.entries()];
  return entires.reduce((acc: Record<string, string | string[]>, tuple) => {
    // get the key and value from each tuple
    const [key, val] = tuple;

    if (acc.hasOwnProperty(key)) {
      // if the current key is already an array, add the value to it
      if (Array.isArray(acc[key])) {
        acc[key] = [...(acc[key] as string[]), val];
      } else {
        // if it's not an array, but contains a value, convert it into an array and add the current value
        acc[key] = [acc[key] as string, val];
      }
    } else {
      // just assign the value if it's not already there
      acc[key] = val;
    }

    return acc;
  }, {});
};

/**
 * Modifies the existing URLSearchParams based on the provided action.
 *
 * @param {URLSearchParams} existingParams - The current URL search parameters.
 * @param {Record<string, boolean>} newParams - The new parameters to add or remove.
 * @param {'add' | 'remove'} action - The action to perform: 'add' to add or merge parameters, 'remove' to remove parameters.
 * @returns {URLSearchParams} The updated URL search parameters.
 *
 * @example
 * // Adding new parameters
 * const existingParams = new URLSearchParams('auto=fm');
 * const newParams = { fit: 'crop' };
 * const updatedParams = paramsReducer(existingParams, newParams, 'add');
 * console.log(updatedParams.toString()); // 'auto=fm&fit=crop'
 *
 * @example
 * // Removing parameters
 * const existingParams = new URLSearchParams('auto=format&fit=crop');
 * const newParams = { fit: 'crop' };
 * const updatedParams = paramsReducer(existingParams, newParams, 'remove');
 * console.log(updatedParams.toString()); // 'auto=format'
 */
export const paramsReducer = (
  existingParams: URLSearchParams,
  newParams: Record<string, string | boolean | undefined>,
  action: 'add' | 'remove',
) => {
  switch (action) {
    case 'add':
      return addOrMergeParams(existingParams, newParams);
    case 'remove':
      return removeParams(existingParams, newParams);
  }
};

/**
 * Stringifies value to '' if the value is null
 */
export const replaceNullWithEmptyString = (_: any, value: any) =>
  value === null ? '' : value;

/*
 * Stringifies all JSON field values within the asset.attribute object
 */
export const stringifyJsonFields = (
  object: Record<string, any>,
  fields: string[] = [],
): Record<string, any> => {
  const normalizedObject = { ...object };

  for (const field of fields) {
    if (!normalizedObject[field]) {
      continue;
    }
    normalizedObject[field] = JSON.stringify(
      normalizedObject[field],
      replaceNullWithEmptyString,
    );
  }

  return normalizedObject;
};
