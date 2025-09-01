import { assignProperties } from "../assignProperties";
import { IS_MEET_EVENTS } from "./ISMeetEvents";
import { MCSL_A_MEET_EVENTS } from "./McslAMeetEvents";
import { MCSL_B_MEET_EVENTS } from "./McslBMeetEvents";
import { MCSL_DIVISIONALS_EVENTS } from "./McslDivEvents";
import { EventsTemplate } from "./EventsTemplate";
import { RELAY_CARNIVAL_EVENTS } from "./RelayCarnivalEvents";
import { PRACTICE_TIMES_EVENTS } from "./PracticeTimes";

const MCSL_A_MEET_EVENTS_TEMPLATE = new EventsTemplate(MCSL_A_MEET_EVENTS);
const MCSL_B_MEET_EVENTS_TEMPLATE = new EventsTemplate(MCSL_B_MEET_EVENTS);
const MCSL_DIVISIONALS_EVENTS_TEMPLATE = new EventsTemplate(MCSL_DIVISIONALS_EVENTS);
const IS_MEET_EVENTS_TEMPLATE = new EventsTemplate(IS_MEET_EVENTS);
const RELAY_CARNIVAL_EVENTS_TEMPLATE = new EventsTemplate(RELAY_CARNIVAL_EVENTS);
const PRACTICE_TIMES_EVENTS_TEMPLATE = new EventsTemplate(PRACTICE_TIMES_EVENTS);

class MeetType {
  constructor(meetType) {
    assignProperties(this, meetType, {
        name: '',
        points: [],
        relayPoints: [],
        lanes: 6,
        seeding: 'standard',
        swimUps: 'Unlimited'
    });
    assignProperties(this, meetType.eventsTemplate);
  }
}

const AMeet = new MeetType({
    name: "A Meet",
    eventsTemplate: MCSL_A_MEET_EVENTS_TEMPLATE,
    points: [6, 4, 3, 2, 1],
    relayPoints: [8, 4, 2],
    lanes: 6,
    seeding: 'alternate',
    swimUps: 'Strict'
});

const DivisionalMeet = new MeetType({
    name: "Divisionals",
    eventsTemplate: MCSL_DIVISIONALS_EVENTS_TEMPLATE,
    points: [16, 13, 12, 11, 10, 9, 7, 5, 4, 3, 2, 1],
    relayPoints: [28, 20, 16, 12, 8, 4],
    lanes: 6,
    swimUps: 'Strict'
});

const RelayCarnival = new MeetType({
    name: "Relay Carnival",
    eventsTemplate: RELAY_CARNIVAL_EVENTS_TEMPLATE,
    relayPoints: [14, 10, 8, 6, 4, 2],
    lanes: 6,
    swimUps: 'Strict'
});

const BMeet = new MeetType({
    name: "B Meet",
    eventsTemplate: MCSL_B_MEET_EVENTS_TEMPLATE,
    swimUps: 'Unlimited'
});

const ISMeet = new MeetType({
    name: "Intrasquad",
    eventsTemplate: IS_MEET_EVENTS_TEMPLATE,
    swimUps: 'Unlimited'
});

const PracticeTimes = new MeetType({
    name: "Practice Times",
    eventsTemplate: PRACTICE_TIMES_EVENTS_TEMPLATE,
    swimUps: 'Unlimited'
});

const BlankMeet = new MeetType({
    name: 'New Meet Type',
    eventsTemplate: { events: []},
    swimUps: 'Unlimited'
});

const MCSL_MEETS = {
    A: AMeet,
    DIV: DivisionalMeet,
    REL: RelayCarnival,
    B: BMeet,
    IS: ISMeet,
    PT: PracticeTimes
}

export { MCSL_MEETS, BlankMeet, MeetType };