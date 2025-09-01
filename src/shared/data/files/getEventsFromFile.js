import { STROKES } from "@models/LeagueData";
import { EventsTemplate } from "@models/MeetTypes/EventsTemplate";
import { getFileFormat } from "@files/FileFormat";
import { MCSL_MEETS } from "@models/MeetTypes/MeetType";

function getEventsFromFile(file) {
    const eventData = file.getEvents();
    let eventsMap = new Map(); // Use a Map for quick lookups
    let maxEventNumber = 0; // Start with 0 to calculate the maximum event number

    // Process all events and find the maximum event number
    eventData.forEach(data => {
        let strokeData = { code: data.stroke, relay: data.label ? true : false };
        let strokeIndex = STROKES.findIndex(stroke => stroke[fileFormat.extension] === strokeData.code && stroke.relay === strokeData.relay);
        
        let eventNumber = parseInt(data.eventNumber);

        console.log(data);
        let newEvent = {
            n: eventNumber,
            gender: data.eventGender,
            ages: [data.ageLower === 'UN' ? 0 : parseInt(data.ageLower), 
                   data.ageUpper === 'OV' ? 109 : parseInt(data.ageUpper)],
            distance: parseInt(data.distance),
            stroke: strokeIndex
        };

        // Store in Map to prevent duplicates
        if (!eventsMap.has(eventNumber)) {
            eventsMap.set(eventNumber, newEvent);
            maxEventNumber = Math.max(maxEventNumber, eventNumber); // Update max
        }
    });

    // Fill missing events from 1 to maxEventNumber
    let events = [];
    for (let n = 1; n <= maxEventNumber; n++) {
        if (eventsMap.has(n)) {
            events.push(eventsMap.get(n)); // Add real event
        } else {
            // Add blank event for missing numbers
            events.push({
                n,
                gender: 'X',
                ages: [110, 110],
                distance: 0,
                stroke: 0
            });
        }
    }

    let newEventsTemplate = new EventsTemplate({ events });
    let meetTypes = Object.values(MCSL_MEETS);
    console.log(newEventsTemplate);
    let matchingMeetTypes = meetCompatibilityCheck(meetTypes, newEventsTemplate);
    console.log(matchingMeetTypes);
}

function meetCompatibilityCheck(meetTypes, eventsTemplate) {
    let matchingMeetTypes = [];
    let currentEventsTemplate;
    let match = false;

    meetTypes.forEach(meetType => {
        if (currentEventsTemplate === meetType.eventsTemplate) {
            if (match) matchingMeetTypes.push(meetType);
        } else {
            currentEventsTemplate = meetType.eventsTemplate;
            match = eventsTemplate.events.every((event, index) =>
                event.stroke.abbr === '' || eventsAreEqual(event, currentEventsTemplate.events[index])
            );

            if (match) matchingMeetTypes.push(meetType);
        }
    });

    return matchingMeetTypes;
}


function eventsAreEqual(event1, event2){
    if (event1.gender !== event2.gender) return false;
    if (event1.distance !== event2.distance) return false;
    if (event1.stroke !== event2.stroke) return false;
    
    if (event1.ages[0] !== event2.ages[0]) return false;
    if (event1.ages[1] !== event2.ages[1]) return false;
    return true;
}

export { getEventsFromFile, eventsAreEqual };