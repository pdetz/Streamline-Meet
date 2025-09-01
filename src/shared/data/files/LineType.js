import { assignProperties } from "../../models/assignProperties";

class LineType {
    constructor(lineType) {
        // prefix, fileFormat, shared, keysToParse
        assignProperties(this, lineType,
            {entries:[], results:[], roster:[]}
        );
    }

    hasKeys(keys, type = 'entries') {
        let searchKeys = [...this.shared, ...this[type]].map(obj => obj.key);
        return keys.every(key => searchKeys.includes(key));
    }

  }

export { LineType }