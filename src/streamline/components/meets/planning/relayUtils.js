// relayUtils.js
import { writable } from 'svelte/store';
import { Swim, NO_SWIM } from "@models/Swim";
import Relay from '@models/Relay';

// Store for selected relays by relay plan
export const selectedRelays = writable([]);

export function fastestNRelays(relayEvent, teams, unavailable = [], n=1, r=1) {
    let relays = [];
    let unavailableSwimmers = [...unavailable];
    teams.forEach(team => {
        const l = relayEvent.planning.filter(relay => relay.team.abbr === team.abbr).length;
        for (let i = l+1; i <= r; i++) {
            // Mark current relay swimmers as unavailable for further recursion
            const bestRelays = fastestRelays(relayEvent, team, unavailableSwimmers, n, i);
    
            if (bestRelays.length === 0) break;
    
            const bestSwimmers = bestRelays[0].swims.map(swim => swim.swimmer);
            unavailableSwimmers.push(...bestSwimmers);// = [...absences, ...bestSwimmers]; // new array to prevent side effects
            relays.push(...bestRelays);
        };
    });
    return relays.sort((a, b) => a.seed - b.seed);
}

export function fastestRelays(relayEvent, team, absences=[], r=5, label=1) {
    //console.log("Finding fastest relays for", relayEvent, "from", team);
    let permutations = [];
    if (relayEvent.stroke.abbr === 'FRL') {
        permutations = [FR[relayEvent.legs.length - 2]];
    } else {
        permutations = MR4;
    }

    let availableSwimmers = relayEvent.swimmers.map(swimmerProfile => {
        return relaySwimmersByAgeGroupAndTeam(relayEvent, swimmerProfile, team, absences);
    });

    // Calculate potential relays
    let bestRelays = [];
    permutations.forEach(permutation => {
        const relay = createPotentialRelay(relayEvent, team, permutation, availableSwimmers, label);
        if (relay && !relayExists(relay, bestRelays)) {
            bestRelays.push(relay);
        }
    });

    // Sort potential relays by seed time
    const relays = bestRelays.sort((a, b) => a.seed - b.seed).slice(0, r);
    return relays;
}

function relaySwimmersByAgeGroupAndTeam(relayEvent, ageGroup, team, absences = []) {
    return relayEvent.meet.getMeetAgeGroup(ageGroup).swimmers
    .filter(swimmer => !absences.includes(swimmer) && swimmer.team.abbr === team.abbr);
}

function createPotentialRelay(relayEvent, team, permutation, availableSwimmers, label=1) {
    let usedSwimmers = new Set();
    let bestSplits = new Array(relayEvent.legs.length);
    
    //console.log('availableSwimmers', availableSwimmers);
    
    permutation.forEach((p, index) => {
        const leg = relayEvent.legs[p];
        bestSplits[p] = findFastestSplit(availableSwimmers[index], { ...leg }, relayEvent, usedSwimmers);
    });

    // Filter out NO_SWIM entries
    bestSplits = bestSplits.filter(split => split.seed < 9990);

    if (bestSplits.length === relayEvent.legs.length) {
        const potentialRelay = new Relay({
            swims: bestSplits,
            event: relayEvent,
            type: 'planning',
            team: team,
            hypothetical: true,
            label: nToL(label)
        });
        if (relayEvent.stroke.abbr === 'FRL' && !relayEvent.swimmerOrderFixed) {
            sortFreeRelay2431(potentialRelay);
        }
        //console.log('Relay created:', potentialRelay);
        return potentialRelay;
    } else {
        return null;
    }
}

function findFastestSplit(swimmers, event, relayEvent, usedSwimmers) {
    let fastestSwimmer = null; //{nombre: ' ', apellido: ' ', key: 'no_swimmer'};
    let bestSplit = NO_SWIM;

    swimmers.forEach(swimmer => {
        if (usedSwimmers.has(swimmer)) return;

        const currentBestSwim = swimmer.bestSplit(event);
        if (currentBestSwim.seed < bestSplit.seed) {
            fastestSwimmer = swimmer;
            bestSplit = currentBestSwim;
        }
    });

    if (bestSplit === NO_SWIM) return NO_SWIM;
    
    usedSwimmers.add(fastestSwimmer);
    return new Swim({
        swimmer: fastestSwimmer,
        event: relayEvent,
        meet: bestSplit.meet,
        distance: event.distance,
        stroke: event.stroke,
        seed: bestSplit.seed,
        result: null,
        converted: bestSplit.converted,
        relayLeg: true,
        add: false
    });
}

export function findRelaysByTeams(relayEvent, teams) {
    let relays = [];
    teams.forEach(team => {
        relays.push(...findRelaysByTeam(relayEvent, team));
    });
    return relays.sort((a, b) => a.result - b.result);
}

export function findRelaysByTeam(relayEvent, team) {
    return team.meets
        .filter(meet => meet.completed)
        .reduce((relays, meet) => {
            return relays.concat(
                meet.relayEvents
                    .filter(event => relayEvent.isEqualTo(event))
                    .flatMap(event => event.results)
                    .filter(result => result.result < 9997)
                    .filter(result => result.team.abbr === team.abbr)
            );
        }, [])
        .sort((a, b) => a.result - b.result);
}

export function relayExists(newRelay, potentialRelays) {
    return potentialRelays.some(existingRelay => {
        if (existingRelay.seed !== newRelay.seed) {
            return false;
        }
        // Check if the swims in each leg are identical
        return existingRelay.swims.every((existingSwim, index) => {
            const newSwim = newRelay.swims[index];
            return existingSwim.swimmer === newSwim.swimmer && 
                   existingSwim.distance === newSwim.distance && 
                   existingSwim.stroke === newSwim.stroke;
        });
    });
}

export function findFastestSplits(relay, legIndex, usedSwimmers = []) {
    const relayEvent = relay.event;
    const team = relay.team;
    const meet = relayEvent.meet;
    let potentialSwimmers = [];

    console.log('index', legIndex);

    if (relayEvent.swimmerOrderFixed) {
        potentialSwimmers = meet.getMeetAgeGroup(relayEvent.swimmers[legIndex]).swimmers;
    } else {
        const availableMeetAgeGroups = relayEvent.swimmers
            .map(ag => meet.ageGroups.find(meetAG => meetAG.contains(ag)))
            .filter(ag => ag !== undefined)
        
        const selectedSwimmerAgeGroup = meet.swimmerAgeGroup(relay.swims[legIndex].swimmer);
        if (selectedSwimmerAgeGroup) availableMeetAgeGroups.push(selectedSwimmerAgeGroup);
        
        const usedAgeGroups = relay.swims
            .map(swim => meet.swimmerAgeGroup(swim.swimmer))
            .filter(ag => ag !== null);
        
        for (const usedAG of usedAgeGroups) {
            const indexToRemove = availableMeetAgeGroups.findIndex(
                availableAG => availableAG.name === usedAG.name // Assuming age groups have a unique 'id'
            );
            if (indexToRemove !== -1) availableMeetAgeGroups.splice(indexToRemove, 1);
        }
        const uniqueAvailableMeetAgeGroups = new Set(availableMeetAgeGroups);

        for (const ageGroup of uniqueAvailableMeetAgeGroups) {
            potentialSwimmers.push(...ageGroup.swimmers);
        }
    }
    return potentialSwimmers
        .filter(swimmer => swimmer.team.abbr === team.abbr && !usedSwimmers.includes(swimmer))
        .map(swimmer => swimmer.bestSplit(relayEvent.legs[legIndex]))
        .sort((a, b) => a.seed - b.seed);
}

export function sortFreeRelay2431(relay) {
  if (relay.swims.length !== 4) return;
  relay.swims.sort((a, b) => a.seed - b.seed);
    const sortedSwims = [
        relay.swims[1],
        relay.swims[3],
        relay.swims[2],
        relay.swims[0]
    ]
  relay.swims = sortedSwims;         
}

export function nToL(n) {
    return String.fromCharCode(64 + n);
}

const FR = [ [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7] ];
const MR4 = generatePermutations([0, 1, 2, 3]);

function generatePermutations(order) {
    if (order.length === 0) return [[]];
    const result = [];
    for (let i = 0; i < order.length; i++) {
      const rest = generatePermutations(order.slice(0, i).concat(order.slice(i + 1)));
      for (const perm of rest) {
        result.push([order[i]].concat(perm));
      }
    }
    return result;
  }  