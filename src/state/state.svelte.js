import Meet from "@src/shared/models/Meet";

export const STATE = $state({
  meet: new Meet({name: 'Test Meet', meetType: ''}),
  meetLoading: true,
  selectedEvent: null,
  newEventsTemplate: {
    events: []
  },
  view: null,
  viewOptions: [],
  // Other app-wide properties
  user: null,
  isLoggedIn: false
});

export const TEST1 = $state({
  meet: new Meet({name: 'Test Meet', meetType: ''}),
});

export const TEST2 = $state({
  meet: {
    name: "test meet",
    events: [
      { n: 1,
        stroke: "Free",
        distance: 100
      }
    ],
    type: {
      eventsTemplate: {
        events: [
          { n: 1,
            stroke: "Free",
            distance: 100
          }
        ]
      }
    }
  },
  otherProps: "just some test data"
});