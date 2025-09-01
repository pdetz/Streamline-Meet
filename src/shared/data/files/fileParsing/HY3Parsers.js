import { Swim, NO_SWIM } from "@models/Swim";
import { assignProperties } from "../../../models/assignProperties";
import Relay from "@models/Relay";

const HY3Parsers = {
  A1: (fileData, current) => { // Parse File Type
    switch (fileData.fileCode) {
      case '03': current.type = 'roster'; break;
      case '02': current.type = 'entries'; break;
      case '04': current.type = 'results'; break;
      case '07': current.type = 'results'; break;
      default: return false; // Exit the loop
    }
  },
/*
  B1: (meetData, current) => { // Parse Meet Info
    assignProperties(current.meet, meetData);
  },
*/
  C1: (teamData, current) => { // Parse Team
    if (current.type === 'roster') return;
    current.team = current.meet.getTeamByAbbreviation(teamData.teamAbbr);
  },

  D1: (swimmerData, current) => { // Parse Swimmer
    if (current.team === undefined || current.team === null) return;
    const { currentId, ...restOfSwimmerData } = swimmerData;
    const key = `${swimmerData.nombre}${swimmerData.apellido}${swimmerData.age}`;
    current.swimmer = current.team.addSwimmer({
      ...restOfSwimmerData,
      key: key.toLowerCase(),
      team: current.team
    });
    current.swimmer.currentId = currentId;
    if (current.type === 'roster') current.swimmer.id = currentId;
  },

  D2: (parentData, current) => { // Parse Parent
    current.swimmer.parents.push({
      ...parentData
    });
  },

  D_: (parentData, current) => { // Parse Parent
    current.swimmer.parents.push({
      ...parentData
    });
  },

  E1: (entryData, current) => { // Parse Entry
    if (current.team === undefined || current.team === null) return;
    const { eventNumber, seed, exhibition } = entryData;
    current.swim = new Swim({
      swimmer: current.swimmer,
      meet: current.meet,
      event: current.meet.events[parseInt(eventNumber) - 1],
      seed: seed === '0.00' ? 9999 : parseFloat(seed), // Explicitly handle seed
      exhibition: exhibition === 'X', // Explicitly handle exhibition
      type: current.entriesPlanningOrResults // Use the appropriate type
    });
    
  },

  E2: (resultData, current) => { // Parse Result
    //console.log('HY3Parsers E2', resultData);
    if (current.team === undefined || current.team === null) return;
    const { resultCode, result, heat, lane, place, date } = resultData;
    const processedResult = processResult(resultCode, result);
    assignProperties(current.swim, 
      { ...processedResult, // result, dq if applicable
        heat: parseInt(heat), 
        lane: parseInt(lane), 
        place: place === '0' ? '' : parseInt(place), 
        date  
      });
  },

  F1: (relayData, current) => { // Parse Relay
    if (current.team === undefined || current.team === null) return;
    const { label, eventNumber, seed, exhibition } = relayData;
    current.relay = new Relay({
      label,
      event: current.meet.events[parseInt(eventNumber) - 1],
      seed: seed === '0.00' ? 9999 : parseFloat(seed), // Explicitly handle seed
      exhibition: exhibition === 'X', // Explicitly handle exhibition
      type: current.entriesPlanningOrResults, // Use the appropriate type
      team: current.team
    });
    current.relay.addRelay(); // Add the relay to the event
    current.swim = current.relay;
  },

  F2: (relayResultData, current) => { // Parse Relay Result
    if (current.team === undefined || current.team === null) return;
    const { resultCode, result, heat, lane, place, date } = relayResultData;
    const processedResult = processResult(resultCode, result);
    assignProperties(current.relay, 
      { ...processedResult, // result, dq if applicable
        heat: parseInt(heat), 
        lane: parseInt(lane), 
        place: place === '0' ? '' : parseInt(place), 
        date  
      });
  },

  F3: (relaySwimmerData, current) => { // Parse Relay Swimmer
    if (current.team === undefined || current.team === null) return;
    const swimmers = Object.keys(relaySwimmerData)
        .filter(key => key.startsWith('id')) // Filter keys that start with 'id'
        .map(key => ({ currentId: relaySwimmerData[key] }) )
        .map(swimmer => current.team.findSwimmerByKey(swimmer, 'currentId')); // Map to their values
    
        current.relay.swims = current.relay.event.legs.map((leg, index) => {
          const currentSwimmer = swimmers[index];
          if (currentSwimmer) {
              return new Swim({
                  relayLeg: true,
                  event: current.relay.event,
                  distance: leg.distance, 
                  stroke: leg.stroke, 
                  swimmer: currentSwimmer,
                  meet: current.meet
              });
          }
          return NO_SWIM; // Or null, depending on how you want to handle missing swimmers
      });
  },

  F4: (relaySplitData, current) => { // Parse Relay Split
    //let converted = false;
    if (current.team === undefined || current.team === null) return;
    current.relay.swims.forEach((swim, index) => {
      swim.seed = parseFloat(relaySplitData[`split${index + 1}`]);
      swim.converted = relaySplitData[`converted${index + 1}`] === '*';
    });
    current.relay.updateTime('seed');
    current.relay.hypothetical = relaySplitData.hypothetical === '*';
  },

  H1: (dqData, current) => { // Parse DQ
    if (current.team === undefined || current.team === null) return;
    const { dqCode, dqDescription } = dqData;
    current.swim.dq = { code: dqCode, description: dqDescription };
  },

  H2: (dqData, current) => { // Parse DQ
    if (current.team === undefined || current.team === null) return;
    const { dqCode, dqDescription } = dqData;
    //current.swim.dq = { code: dqCode, description: dqDescription };
    if (current.relay.dq.code.startsWith('6')) {
      let dqLeg = parseInt(current.relay.dq.code.slice(-1));
      current.relay.swims[dqLeg - 1].dq = { code: dqCode, description: dqDescription };
    }
  }

};

// Return dq {description: ''} if place === 'DQ'

export function processResult(resultCode, result) {
  if (resultCode === '') return { result: parseFloat(result) };
  if (resultCode === 'Q') return { result: 9996, dq: { code: '', description: 'test' } };
  if (resultCode === 'R') return { result: 9997 };
  return { result: 9999 };
}
  
export { HY3Parsers };