import { loadParseObjectById, loadParseObjects } from "@data/LoadParseObjects";
import { parseDateString } from "@models/cleanData";
import File from "@files/File";
import { processResult } from "@files/fileParsing/HY3Parsers";

export async function getSwims(swimmer) {
    let swims = [];

    const team = await loadParseObjectById('Team', swimmer.teamId);
    let meets = await loadParseObjects('Meet', {}, {'teamIds': [swimmer.teamId]})
    meets = meets.sort((a, b) => {
        const dateA = parseDateString(a.startDate);
        const dateB = parseDateString(b.startDate);
        return dateA - dateB; // Sort by date ascending
    });

    meets.forEach(meet => {
        const resultsFile = new File(meet.resultsFiles[0]);
        if (resultsFile && resultsFile.name !== 'NULL_FILE.hy3') {
            swims.push(...extractSwimsFromMeet(swimmer, meet, resultsFile));
        }
    });

    console.log("Extracted Swims:", swims);

    return swims;
}

function extractSwimsFromMeet(swimmer, meet, resultsFile) {
    const swims = [];
    const contents = resultsFile.contents || '';
    const lines = contents.split('\n').filter(line => line.trim() !== '');

    const ff = resultsFile.fileFormat;
    const resultsLines = ['D1', 'E1', 'E2'];

    let currentSwimmerMatch = false;
    let currentEvent = null;

    console.log("Processing Results File:", resultsFile.name);
    console.log("File format:", ff.name);

    lines.forEach(line => {
        if (!resultsLines.some(prefix => ff.getPrefix(line))) {
            return; // Skip lines that do not match the expected prefixes
        }
        const parsedData = resultsFile.fileFormat.parse(line, 'results');
        if (ff.getPrefix(line) === 'D1') {
            if (parsedData && parsedData.nombre === swimmer.nombre && parsedData.apellido === swimmer.apellido && parseInt(parsedData.age) === swimmer.age) {
                currentSwimmerMatch = true;
            } else {
                currentSwimmerMatch = false; // Reset if swimmer does not match
                return; // Skip to next line if swimmer does not match
            }
        } else if (!currentSwimmerMatch) {
            return; // Skip lines if the current swimmer does not match
        }
        if (ff.getPrefix(line) === 'E1') {
            currentEvent = meet.events[parseInt(parsedData.eventNumber) - 1];
        } else if (ff.getPrefix(line) === 'E2' && currentEvent) {
            console.log("E2 parsed data:", parsedData);
            
            const processedResult = processResult(parsedData.resultCode, parsedData.result);
            const swim = {
                swimmer: swimmer,
                event: currentEvent,
                result: processedResult.result,
                meet: meet

            };
            swims.push(swim);
        }
    });
    
    return swims;
}