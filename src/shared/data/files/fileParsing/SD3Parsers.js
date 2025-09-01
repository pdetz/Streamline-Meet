import Relay from '@models/Relay';
import { Swim } from '@models/Swim';
import { assignProperties } from '../../../models/assignProperties';
import { timeToNumber } from '../../../models/Swim';

const SD3Parsers = {
  A0: (fileData, current) => { // Parse Meet File Info
    if (current.type === 'roster') return;
    switch (fileData.fileCode) {
      case '20':
      case '01': current.type = 'entries'; break;
      case '02': current.type = 'results'; break;
      default: return false; // Exit the loop
    }
  },

  C1: (teamData, current) => { // Parse Team
    if (current.type === 'roster') return;
    current.team = current.meet.getTeamByAbbreviation(teamData.teamAbbr);
  },

  D0: (swimmerEntryData, current) => { // Parse Swimmer, Entry, and Result
    
    if (!current.team) return; // Ignore swimmers that don't belong to a team
    // Extract swimmer-related properties using destructuring
    const { swimmerName, gender, ussID, dob, age, ...entryResultData } = swimmerEntryData;

    // Parse swimmer's name
    const parsedName = parseSd3Name(swimmerName, age);

    // Add swimmer to the team
    if (current.swimmer.key !== parsedName.key) { // Skip if swimmer already exists
      current.swimmer = {
          ...parsedName, // apellido, nombre, middleInitial
          gender,
          dob,
          age,
          ussID,
          key: parsedName.key,
          team: current.team
      };
    }

    // Process entry and result data if not a roster file
    if (current.type !== 'roster') {
        current.swimmer = current.team.addSwimmer(current.swimmer); // Add swimmer to the team
        // Extract entry-related fields and leave result-specific fields in resultData
        const { eventNumber, seed, exhibition, ...resultData } = entryResultData;

        // Create a Swim object for entries or results
        current.swim = new Swim({
            swimmer: current.swimmer,
            meet: current.meet,
            event: current.meet.events[eventNumber - 1],
            seed: timeToNumber(seed),
            exhibition: exhibition === 'X',
            type: current.type
        });

        // Handle result-specific data if it's a results file
        if (current.type === 'results') {
            const { result, heat, lane, place, date } = resultData;
            const processedResult = processResult(result); // Convert result to numeric format
            assignProperties(current.swim, 
              { ...processedResult, // result, dq if applicable
                heat: parseInt(heat), 
                lane: parseInt(lane), 
                place: place === '0' ? '' : parseInt(place), 
                date  
              }); // Assign remaining result data to the Swim object
        }
    }
  },

  D3: (additionalData, current) => { // Parse Additional Swimmer Info
    if (current.type !== 'roster') return;
    if (!current.team) return; // Ignore swimmers that don't belong to a team
    
    assignProperties(current.swimmer, additionalData); // nickname, middle name
    current.swimmer = current.team.addSwimmer(current.swimmer);
  },

  E0: (relayData, current) => { // Parse Relay Entry
    const { label, eventNumber, seed, exhibition, ...relayResultData } = relayData;

    current.relay = new Relay({
      label,
      event: current.meet.events[parseInt(eventNumber) - 1],
      seed: timeToNumber(seed), // Explicitly handle seed
      exhibition: exhibition === 'X', // Explicitly handle exhibition
      type: current.entriesPlanningOrResults, // Use the appropriate type
      team: current.team
    });
    current.relay.addRelay(); // Add the relay to the event
    if (current.type === 'results') {
        const { result, heat, lane, place, date } = relayResultData;
        const processedResult = processResult(result);
        assignProperties(current.relay, 
          { ...processedResult, // result, dq if applicable
            heat: parseInt(heat), 
            lane: parseInt(lane), 
            place: place === '0' ? '' : parseInt(place), 
            date  
          });
    }
  },

  F0: (relaySwimmerData, current) => { // Parse Relay Swimmer
    const { swimmerName, ussID, age, legNumber } = relaySwimmerData;
    const currentSwimmer = current.team.addSwimmer({
      ussID,
      key: parseSd3Name(swimmerName, age).key
    });
    if (currentSwimmer) {
      let leg = current.relay.event.legs[legNumber - 1];
      current.relay.swims[legNumber - 1] = new Swim({
        relayLeg: true,
        event: current.relay.event,
        distance: leg.distance, 
        stroke: leg.stroke, 
        swimmer: currentSwimmer,
        meet: current.meet
      });
    }
  },
/*
  G0: (splitData, current) => { // Parse Splits
    const swim = current.swimmer.swims.find(swim => swim.eventNumber === splitData.eventNumber);
    if (swim) {
      swim.addSplits(splitData);
    }
  }
    */
};

function processResult(result) {
  const processedResult = timeToNumber(result);
  if (processedResult === 9996) return { result: processedResult, dq: {code: '', description: ''} };
  return { result: processedResult }
}

function parseSd3Name(name, age) {
  const [apellido, firstMiddle] = name.split(', ');
  const fmi = firstMiddle.split(' ').filter(f => f !== '');

  let middleInitial = '';
  let nombre = fmi[0];

  if (fmi.length > 1) {
    middleInitial = fmi.pop();
    nombre = fmi.join(' ');
    
    if (middleInitial.length > 1) {
      nombre += ' ' + middleInitial;
      middleInitial = '';
    }
  }

  const key = `${nombre}${apellido}${age}`;
  return { apellido, nombre, middleInitial, key };
}

export { SD3Parsers };