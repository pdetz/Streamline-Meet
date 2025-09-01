import { transformParseObjects, transformParseObject } from '@models/models';
import { queryParseObjects } from './ParseHelpers.js';
import Parse from 'parse/dist/parse.min.js';

async function loadParseObjects(className, props = {}, arrays = {}) {
  //console.log(`Loading ${className} objects with props:`, props, 'and arrays:', arrays);
  try {
    const rawParseObjects = await queryParseObjects(className, props, arrays);
    return transformParseObjects(rawParseObjects);
  } catch (error) {
    console.error(`Error loading or transforming ${className} data:`, error);
    return [];
  }
}

async function loadParseObjectById(className, objectId, store = null) {

    if (!Parse.applicationId) {
        console.error('Parse SDK not initialized in loadParseObjectById!');
        // Throwing an error here ensures the outer promise chain catches it.
        throw new Error('Parse SDK not initialized. Cannot load Parse object.');
    }

    if (!objectId || typeof objectId !== 'string' || objectId.length === 0) {
        console.warn(`loadParseObjectById: Invalid or missing objectId provided for ${className}:`, objectId);
        return null; // Return null early for invalid IDs
    }

    const query = new Parse.Query(className);
    try {
        // *** CRITICAL CHANGE: Use query.get() for direct ID lookup ***
        const existingObject = await query.get(objectId);

        if (existingObject) {
            // Assuming transformParseObject is defined elsewhere and works correctly
            const transformedObject = transformParseObject(existingObject);

            if (store && typeof store.set === 'function') {
                store.set(transformedObject);
            } else if (store !== null) {
                console.warn("Provided 'store' object does not have a 'set' method.");
            }
            return transformedObject;
        } else {
            console.warn(`No ${className} found with ID: ${objectId} (this case should be rare with query.get()).`);
            return null;
        }
    } catch (error) {
        if (error.code === 101) {
            console.warn(`loadParseObjectById: ${className} with ID ${objectId} not found. (Parse Error Code: 101)`);
            return null; // Explicitly return null if object not found
        }
        console.error(`Error loading ${className} by ID ${objectId}:`, error);
        if (error.code) {
            console.error(`Parse Error Details: Code ${error.code}, Message: ${error.message}`);
        }
        throw error; // Re-throw the error so your Svelte component's catch block can handle it.
    }
}

export { loadParseObjects, loadParseObjectById };