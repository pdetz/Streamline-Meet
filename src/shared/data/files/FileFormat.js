import { HY3LineTypes } from './HY3LineTypes';
import { HY3Parsers } from '@files/fileParsing/HY3Parsers';
import { SD3LineTypes } from './SD3LineTypes';
import { SD3Parsers } from '@files/fileParsing/SD3Parsers';

class FileFormat {
    constructor({ extension, prefixLength, lineLength, checkSum = () => '', lineTypes = [], parsers = {} }) {
        this.extension = extension;
        this.prefixLength = prefixLength; // Length of the prefix used to determine line type
        this.lineLength = lineLength;
        this.checkSum = checkSum;
        this.parsers = parsers;

        // Convert lineTypes array into an object with prefix as the key
        this.lineTypes = lineTypes.reduce((acc, lineType) => {
            acc[lineType.prefix] = lineType;
            return acc;
        }, {});
    }

    getPrefix(line) {
        return line.substring(0, this.prefixLength).trim();
    }

    getLineType(line) {
        return this.lineTypes[this.getPrefix(line)];
    }

    getParser(line) {
        return this.parsers[this.getPrefix(line)];
    }

    writeLine(prefix, data = {}, type = 'entries') {
        const lineType = this.getLineType(prefix);
        if (!lineType) return;

        const fieldsToSerialize = [...lineType.shared, ...(lineType[type] || [])];
        const processedData = lineType.parseDataToKeys(data) ?? {};
        const chars = Array(this.lineLength - this.prefixLength).fill(' '); // Pre-allocate the line with spaces

        for (const field of fieldsToSerialize) {
            const { loc: [start, size], key, rJust = false, defaultValue = '' } = field;
            const value = String(processedData[key] ?? defaultValue);
            const writeStart = rJust
                ? start + Math.max(size - value.length, 0) // Right-justify
                : start; // Left-justify

            for (let i = 0; i < Math.min(size, value.length); i++) {
                chars[writeStart + i - prefix.length] = value[i];
            }
        }

        const line = prefix + chars.join('');
        return line + this.checkSum(line) + '\r\n';// if required
    }

    parse(line, type = 'entries', keys = null) {
        const lineType = this.getLineType(line);
        if (!lineType) {
            //console.log(`Line type not found for line: ${line}`);
            return null;
        }
    
        // Combine shared and type-specific fields
        const fieldsToParse = [...lineType.shared, ...lineType[type]];
        const keysToParse = keys || lineType.keysToParse;
    
        // Filter and reduce to create the parsed object
        const parsedData = fieldsToParse
            .filter(field => keysToParse.includes(field.key))
            .reduce((parsed, { loc: [start, size], key }) => {
                parsed[key] = line.substring(start, start + size).trim();
                return parsed;
            }, {});
    
        return parsedData;
    }

    getAllValuesForKey(file, key, type = 'entries') {
        const lineType = Object.values(this.lineTypes).find(lineType => lineType.keysToParse.includes(key));
        if (!lineType) return [];

        const lines = file.contents.split('\n').filter(line => line.startsWith(lineType.prefix));
        if (lines.length === 0) return [];

        return lines.map(line => {
            return this.parse(line, type, [key])[key];
        });
    }

    getSingleKey(file, key, type = 'entries') {
        const lineType = Object.values(this.lineTypes).find(lineType => lineType.keysToParse.includes(key));
        if (!lineType) return '';

        const line = file.contents.split('\n').find(line => line.startsWith(lineType.prefix));
        if (!line) return '';

        return this.parse(line, type, [key])[key];
    }

    getMultipleKeys(file, keys, type = 'entries') {
        return keys.reduce((acc, key) => {
            acc[key] = this.getSingleKey(file, key, type) || '';
            return acc;
        }, {});
    }

    getMultipleKeysMultipleValues(file, keys, optionalKeys, type = 'entries') {
        const lineTypes = Object.values(this.lineTypes)
            .filter(lineType => lineType.hasKeys(keys, type));
        const lines = file.contents.split('\n').filter(line => {
            return lineTypes.some(lineType => line.startsWith(lineType.prefix));
        });
        return lines.map(line => this.parse(line, type, [...keys, ...optionalKeys]));
    }
}

const HY3 = new FileFormat({
    extension: 'hy3',
    lineLength: 128,
    prefixLength: 2,
    checkSum: hy3Checksum,
    lineTypes: HY3LineTypes,
    parsers: HY3Parsers
});

const SD3 = new FileFormat({
    extension: 'sd3',
    lineLength: 159,
    prefixLength: 2,
    checkSum : sd3Checksum,
    lineTypes: SD3LineTypes,
    parsers: SD3Parsers
});
  
function sd3Checksum() { return '  ' };

function hy3Checksum(line) {
    let sumEvn = 0;
    let sumOdd = 0;

    for (let i = 0; i < line.length; i++) {
        let val = line.charCodeAt(i);

        if (i % 2 === 0) {
            sumEvn += val;
        } else {
            sumOdd += 2 * val;
        }
    }

    let sum = sumEvn + sumOdd;
    let result = Math.floor(sum / 21);
    let sum2 = result + 205;

    let onesDigit = sum2 % 10;
    let tensDigit = Math.floor(sum2 / 10) % 10;

    let checksum = `${onesDigit}${tensDigit}`;
    
    return checksum;
}

export { HY3, SD3 };