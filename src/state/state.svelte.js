import Event from "@src/shared/models/Event";

export let STATE = $state({
  meet: null,
  meetLoading: true,
  selectedEvent: null,
  view: null,
  viewOptions: [],
  // Other app-wide properties
  user: null,
  isLoggedIn: false
});