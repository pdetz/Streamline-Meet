class Discrepancy {
    constructor(objects) {
      this.objects = objects; // Array of objects to compare
      this.props = Array.from(
        new Set(
          objects
              .map(meetInfo => Object.keys(meetInfo)) // Get all keys from each meetInfo object
              .reduce((allKeys, keys) => allKeys.concat(keys), []) // Flatten the array of keys
          )
      );
      this.discrepancies = {}; // Store discrepancies { propName: [values] }
      this.resolvedObject = {};
      
      this.findDiscrepancies(); // Initialize the discrepancy check
    }
  
    findDiscrepancies() {
      this.props.forEach((prop) => {
        const values = new Set(
          this.objects
            .map(obj => obj[prop])
            .filter(value => value !== '' && value !== null && value !== undefined)
        );
        if (values.size > 1) { // Discrepancy detected if multiple values exist
          this.discrepancies[prop] = Array.from(values);
        } else if (values.size === 1) {
          this.resolvedObject[prop] = Array.from(values)[0];
        }
      });
    }
  
    resolveDiscrepancies(resolved, ClassName) {
      Object.keys(resolved).forEach(prop => {
        // Remove discrepancy and update objects with the resolved value
        this.resolvedObject[prop] = resolved[prop];
        //
        delete this.discrepancies[prop];
      });
      console.log('resolvedObject: ', this.resolvedObject);
      return new ClassName(this.resolvedObject);
    }
  
    getDiscrepancySummary() {
      // Create a human-readable summary of discrepancies
      return Object.entries(this.discrepancies).map(([prop, values]) => ({
        property: prop,
        conflictingValues: values
      }));
    }
  
    mergeDiscrepancies(ClassName, resolvedValues) {
      const mergedObject = {};
  
      // Cycle through all properties in the objects
      this.props.forEach((prop) => {
        const values = this.objects.map(obj => obj[prop]).filter(value => value !== undefined);
  
        if (values.length === 0) {
          // No value for this property in any object; skip it
          return;
        }
  
        if (values.every(value => value === values[0])) {
          // All objects have the same value; assign it
          mergedObject[prop] = values[0];
        } else if (resolvedValues.some(resolved => resolved.prop === prop)) {
          // Use the resolved value if provided
          mergedObject[prop] = resolvedValues.find(resolved => resolved.prop === prop).resolvedValue;
        }
      });
  
      // Assign remaining resolved values (for props not in the original objects)
      resolvedValues.forEach(({ prop, resolvedValue }) => {
        mergedObject[prop] = resolvedValue;
      });
  
      // Return a new object instance
      return new ClassName(mergedObject);
    }
  } 

  export default Discrepancy;