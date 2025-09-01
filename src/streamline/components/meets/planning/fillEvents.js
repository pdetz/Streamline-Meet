import { Swim, compareTimes } from "@models/Swim";
import { triggerRefresh, pointsStore, selectedRelayEventStore } from "@src/stores";
import { fastestNRelays } from "./relayUtils";

function fillEvents(events) {
    events.forEach(event => {
        fillEvent(event);
    });
    events[0].meet.calculateScore('planning');
    triggerRefresh(pointsStore);
}

function fillEvent(event) {
    const meet = event.meet;
    meet.sortAllSwimmers();
    if (event.stroke.relay) {
        fillRelayEvent(event);
        return;
    }
    let swimmers = meet.getMeetAgeGroup(event.ageGroup).swimmers
        .filter(s => s.getStatus(meet) !== 'Absent');
    let swims = [];
    let allSwims = swimmers
        .map(s => s.best(event))
        .sort((a, b) => compareTimes(a, b))
        .filter(swim => swim.key !== 'no_swim');
    meet.teams.forEach(team => {
        const teamSwims = allSwims.filter(s => s.swimmer.team === team)
                    .slice(0, event.maxEntries);
        swims = swims.concat(teamSwims);
    });
    swims.forEach(swim => {
        const nExistingSwims = event.planning.filter(s => s.swimmer.team === swim.swimmer.team).length;
        if (nExistingSwims >= event.maxEntries) return; // Skip if already filled
        if (event.planning.some(s => s.swimmer.key === swim.swimmer.key)) return; // Skip if already in planning
        new Swim({swimmer: swim.swimmer, event, meet, seed: swim.result, type: 'planning'});
    });
    event.calculateScore(meet.points, 'planning');
  }

function fillRelayEvent(event){
    const meet = event.meet;
    const absences = Array.from(meet.absences.values());
    let newRelays = fastestNRelays(
        event,
        meet.teams,
        [...event.unavailableSwimmers, ...absences],
        1,
        event.maxEntries
    );
    newRelays.forEach(relay => relay.addRelay());
    let selectedRelayEvent;
    const unsubscribe = selectedRelayEventStore.subscribe(value => {
        selectedRelayEvent = value;
    });
    unsubscribe(); // Stop subscribing immediately after getting the value
    if (selectedRelayEvent) selectedRelayEventStore.set(selectedRelayEvent);
}

function clearEvents(events) {
events.forEach(event => {
        for (let i = event.planning.length - 1; i >= 0; i--) {
            const swim = event.planning[i];
            swim.removeSwim(); // Assuming this method removes the swim from event.planning
        }
    });
    events[0].meet.calculateScore('planning');
    triggerRefresh(pointsStore);
} 

export { fillEvents, clearEvents, fillRelayEvent };