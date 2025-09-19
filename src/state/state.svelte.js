import Event from "@src/shared/models/Event";

export const STATE = $state({
  meet: null,
  meetLoading: true,
  selectedEvent: null,
  view: null,
  viewOptions: [],
  // Other app-wide properties
  user: null,
  isLoggedIn: false
});

export function addEventToMeet(newEvent) {
    STATE.meet.events = [...STATE.meet.events, newEvent];
}

export function updateEventInMeet(event, updatedEventData) {
    let index = STATE.meet.events.findIndex(e => e.key === event.key);
    if (index === -1) return;

    let newEvent = { ...STATE.meet.events[index] };

    for (let prop in updatedEventData) {
      newEvent[prop] = updatedEventData[prop];
      console.log(`Updated ${prop} to`, updatedEventData[prop]);
    }

    STATE.meet.events[index] = new Event(newEvent);
    return STATE.meet.events[index];
}