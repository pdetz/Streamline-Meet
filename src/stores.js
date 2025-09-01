import { writable } from 'svelte/store';

export const rosterDataStore = writable([]);
export const viewStore = writable();

export const userStore = writable();

export const seasonStore = writable();
export const leagueStore = writable();

export const MY_TEAM = writable();
export const MY_DIVISION = writable();

//Meets
export const selectedMeetStore = writable(null);
export const selectedAgeGroupStore = writable(null);
export const selectedEventStore = writable(null);
export const selectedRelayEventStore = writable(null);

export const meetViewStore = writable({ viewType: null, props: {} });

export function updateMeetViewStore(meet, viewType='meetNav', props={}) {
    selectedMeetStore.set(meet);
    if (!meet) {
        meetViewStore.set({ viewType: null, props: {} });
        return;
    }
    meet.view = viewType;
    meetViewStore.set({ viewType, props: {meet, ...props} });
}

export const meetEntriesRefresh = writable(true);

export const pointsStore = writable(1);

export const relayOptionsStore = writable(3);

export function triggerRefresh(refreshStore) {
    refreshStore.update(n => n+1);
}

export const MEET = writable(null);

export const meetsToConfirmStore = writable([]);

export function clearStores() {
    /*userStore.set(null);
    seasonStore.set(null);
    leagueStore.set(null);
    MY_TEAM.set(null);
    MY_DIVISION.set(null);*/
    selectedMeetStore.set(null);
    meetViewStore.set({ viewType: null, props: {} });
    selectedAgeGroupStore.set(null);
    selectedEventStore.set(null);
    selectedRelayEventStore.set(null);
    meetEntriesRefresh.set(true);
    pointsStore.set(1);
    MEET.set(null);
    viewStore.set(null);
}