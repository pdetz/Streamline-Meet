export const STATE = $state({
  meet: null,
  meetLoading: true,
  selectedEvent: null,
  view: null,
  viewOptions: [],
  // Other app-wide properties
  user: null,
  isLoggedIn: false,
});

export const MEET = $state(null);