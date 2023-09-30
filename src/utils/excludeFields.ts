/**
 * Utility function to exclude specified fields from an object.
 * @param {T} model - The object from which fields will be excluded.
 * @param {Key[]} keys - An array of field keys to exclude.
 * @returns {Omit<T, Key>} - A new object with specified fields excluded.
 */
export function excludeFields<T, Key extends keyof T>(
  model: T,
  keys: Key[],
): Omit<T, Key> {
  // Iterate through the array of keys and delete each key from the object.
  for (let key of keys) {
    delete model[key];
  }
  // Return the modified object with specified fields excluded.
  return model;
}
