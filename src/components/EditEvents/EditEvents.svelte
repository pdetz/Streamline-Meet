<script>
    import { STATE } from '@src/state/state.svelte.js';
    import EventEditor from './EventEditor.svelte';
    import { EventsTemplate } from '@src/shared/models/MeetTypes/EventsTemplate';
    import Meet from '@src/shared/models/Meet';
    import { MeetType } from '@src/shared/models/MeetTypes/MeetType';

    let events = $derived(STATE.newEventsTemplate.events || []);
    let lastEvent = $derived(events[events.length - 1]);

    function addEvent(eventData=lastEvent) {
        console.log("Adding event", eventData);
        const newEvent = {
            ...eventData,
            ages: [...eventData?.ages] || [0, 109],
            n: events.length + 1,
            selected: false
        };
        //STATE.newEventsTemplate.events.push(newEvent);
        events.push(newEvent);
    }

    function updateEvent(index, field, value) {
        events[index][field] = value;
    }

    function saveEvents() {
        const newEventsTemplate = new EventsTemplate({
            ...STATE.newEventsTemplate,
            events: events.map(e => ({...e, stroke: e.stroke.sd3}))
        });
        const newMeetType = new MeetType({
            ...STATE.meet.type,
            eventsTemplate: newEventsTemplate
        });
        STATE.meet.type = newMeetType;
        STATE.meet.initializeAgeGroupsAndEvents();
        console.log("Events saved to meet", STATE.meet.events);
    }
    function duplicateSelected() {
        const selectedEvents = events.filter(e => e.selected);
        if (selectedEvents.length === 0) return;
        selectedEvents.forEach(event => {
            const newEvent = {
                ...event,
                n: events.length + 1,
                selected: true
            };
            event.selected = false;
            events.push(newEvent);
        });
    }
    function duplicateInterlaced() {
        const selectedEvents = events.filter(e => e.selected);
        if (selectedEvents.length === 0) return;
        selectedEvents.forEach(event => {
            const newEvent = {
                ...event,
                n: event.n + 1,
                selected: true
            };
            for (let i = event.n; i < events.length; i++) {
                events[i].n += 1;
            }
            event.selected = false;
            events.splice(event.n, 0, newEvent);
        });
    }
</script>

<div>
    {STATE.meet.name}
    <button class='sb tool save-events' onclick={saveEvents}>Save Events</button>
    <button class = 'sb tool' onclick={duplicateSelected}>Duplicate Selected</button>
    <button class = 'sb tool' onclick={duplicateInterlaced}>Duplicate Interlaced</button>
    <div class = 'events'>
        {#each events as event, index}
            <EventEditor {event} {index} {events} {updateEvent} />
        {/each}
        <button class = 'sb tool new-event'
            onclick={() => addEvent()}>+ New Event
        </button>
    </div>
</div>

<style>
    div.events {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
</style>