import Parse from 'parse/dist/parse.min.js';

export async function checkIfObjectExists(objectName, props) {
  const query = new Parse.Query(Parse.Object.extend(objectName));
  Object.entries(props).forEach(([prop, value]) => query.equalTo(prop, value));
  return query.first(); // Return the promise
}

export async function queryParseObjects(objectName, props = {}, arrays = {}, options = {limit: 1000}) {
  const query = new Parse.Query(Parse.Object.extend(objectName));
  Object.entries(props).forEach(([prop, value]) => query.equalTo(prop, value));
  Object.entries(arrays).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query.containedIn(key, value);
    } else {
      console.warn(`containedIn filter for key "${key}" received non-array value:`, value);
    }
  });
  if (objectName === '_User') {
    query.include('team');
    query.include('season');
    query.include('league');
  }
  query.limit(options.limit || 1000); // Default limit to 1000 if not specified
  return query.find();
}

export async function newParseObject(objectName, props) {
  try {
    let newObject = new (Parse.Object.extend(objectName))();
    setPropsOnParseObject(newObject, props);
    await newObject.save();
    console.log(`New ${objectName} created successfully.`);
    return newObject;
  } catch (error) {
    console.error(`Error while creating new ${objectName}:`, error);
    throw error; // Propagate the error
  }
}

export async function updateParseObject(object, objectName, props) {
  try {
    const query = new Parse.Query(Parse.Object.extend(objectName));
    const existingObject = await query.get(object.objectId);
    if (existingObject) {
      setPropsOnParseObject(existingObject, props);
      await existingObject.save();
      console.log(`Existing ${objectName} updated successfully.`);
      return existingObject;
    } else {
      console.error(`${objectName} object not found.`);
      return null;
    }
  } catch (error) {
    console.error(`Error while updating ${objectName}:`, error);
    throw error;
  }
}

export async function upsertParseObjectByProps(objectName, queryProps, updateProps) {
  try {
    const existingObject = await checkIfObjectExists(objectName, queryProps);
    if (existingObject) {
      setPropsOnParseObject(existingObject, updateProps);
      await existingObject.save();
      console.log(`Existing ${objectName} upserted successfully.`);
      return existingObject;
    } else {
      const newObject = await newParseObject(objectName, { ...queryProps, ...updateProps });
      return newObject;
    }
  } catch (error) {
    console.error(`Error during upsert operation for ${objectName}):`, error);
    throw error;
  }
}

function setPropsOnParseObject(parseObject, props) {
    // Set the properties on the Parse Object
    for (let prop in props) {
      if (props.hasOwnProperty(prop)) {
          parseObject.set(prop, props[prop]);
      }
    }
  return parseObject;
}