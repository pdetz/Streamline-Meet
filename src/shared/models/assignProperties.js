export function assignProperties(target, source, defaultValues = {}) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  // Assign default values for any properties not in the source object
  for (let key in defaultValues) {
    if (!target.hasOwnProperty(key)) {
      target[key] = defaultValues[key];
    }
  }
}

export function updatedProps(newProps, oldProps, propsToCheck) {
  const differentProps = {};
  for (const key in propsToCheck) {
    if (Object.prototype.hasOwnProperty.call(newProps, key)) {

      if (Array.isArray(newProps[key]) && Array.isArray(oldProps[key])) {
        // Compare arrays
        //console.log('comparing arrays', key, newProps[key], oldProps[key]);
        if (newProps[key].length !== oldProps[key].length || !newProps[key].every((item, index) => item === oldProps[key][index])) {
          differentProps[key] = newProps[key];
        }
      } else if (!Object.prototype.hasOwnProperty.call(oldProps, key) || newProps[key] !== oldProps[key]) {
        differentProps[key] = newProps[key];
      }
    }
  }
  return differentProps;
}