import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Saves a value to AsyncStorage. Handles serialization for non-string types.
 * @param {string} key - The key under which to store the value.
 * @param {any} value - The value to store (can be any serializable type).
 * @returns {Promise<void>} A promise that resolves when saving is complete or rejects on error.
 */
export const saveItem = async (key, value) => {
  if (typeof key !== 'string') {
    console.error('Error saving item: Key must be a string.');
    return Promise.reject(new Error('Key must be a string.'));
  }
  try {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
    // console.log(`Successfully saved item with key: ${key}`);
  } catch (error) {
    console.error(`Error saving item with key "${key}":`, error);
    throw error;
  }
};

/**
 * Retrieves a value from AsyncStorage.
 * If the key doesn't exist, it saves the defaultValue to storage and then returns it.
 * Handles deserialization and default values on errors.
 * @param {string} key - The key of the item to retrieve.
 * @param {any} defaultValue - The value to return AND SAVE if the key doesn't exist, or the value to return on error. Defaults to null.
 * @returns {Promise<any>} A promise that resolves with the retrieved value (or defaultValue).
 */
export const getItem = async (key, defaultValue = null) => {
  if (typeof key !== 'string') {
    console.error('Error getting item: Key must be a string.');
    // Cannot save default if key is invalid, just return default
    return Promise.resolve(defaultValue);
  }
  try {
    const stringValue = await AsyncStorage.getItem(key);

    if (stringValue !== null) {
      // --- Item exists ---
      try {
        const parsedValue = JSON.parse(stringValue);
        // console.log(`Successfully retrieved item with key: ${key}`);
        return parsedValue;
      } catch (parseError) {
        console.error(`Error parsing item with key "${key}":`, parseError);
        console.warn(`Returning default value for key "${key}" due to parsing error.`);
        return defaultValue;
      }
    } else {
      // --- Item does not exist ---
      console.log(`Item with key "${key}" not found. Saving and returning default value.`);
      try {
        // *** NEW: Save the default value if item doesn't exist ***
        await saveItem(key, defaultValue);
        console.log(`Default value saved for key "${key}".`);
      } catch (saveError) {
        // Log error if saving the default fails, but still return the default value
        console.error(`Error trying to save default value for key "${key}":`, saveError);
      }
      // Return the default value whether or not saving it succeeded
      return defaultValue;
    }
  } catch (error) {
    // Handle errors during the AsyncStorage.getItem call itself
    console.error(`Error retrieving item with key "${key}":`, error);
    console.warn(`Returning default value for key "${key}" due to retrieval error.`);
    // Don't attempt to save default on retrieval error, just return default
    return defaultValue;
  }
};

/**
 * Removes an item from AsyncStorage.
 * @param {string} key - The key of the item to remove.
 * @returns {Promise<void>} A promise that resolves when removal is complete or rejects on error.
 */
export const removeItem = async (key) => {
   if (typeof key !== 'string') {
    console.error('Error removing item: Key must be a string.');
    return Promise.reject(new Error('Key must be a string.'));
  }
  try {
    await AsyncStorage.removeItem(key);
    // console.log(`Successfully removed item with key: ${key}`);
  } catch (error) {
    console.error(`Error removing item with key "${key}":`, error);
    throw error;
  }
};

/**
 * Clears all data stored by AsyncStorage for the current app. Use with caution!
 * @returns {Promise<void>} A promise that resolves when clearing is complete or rejects on error.
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage successfully cleared.');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    throw error;
  }
};

// Optional: Combine into a single default export object
const storageService = {
  saveItem,
  getItem,
  removeItem,
  clearAll,
};

export default storageService;