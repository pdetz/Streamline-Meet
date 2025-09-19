<script>
    import Event from '@shared/models/Event';
    import { STATE, addEventToMeet } from '@src/state/state.svelte.js';
    import EventEditor from './EventEditor.svelte';

    let meet = $state(STATE.meet);
    let events = $derived(STATE.meet.events);
    let lastEvent = $derived(events[events.length - 1]);

    function addEvent(eventData=lastEvent) {
        console.log("Adding event", eventData);
        let newEvent = new Event({
            ...eventData,
            n: (eventData?.n || 0) + 1,
        });
        addEventToMeet(newEvent);
        events = [...events, newEvent];
        console.log(STATE.meet.events, events);
    }
</script>

<div>
    {STATE.meet.name}
    <div class = 'events'>
        {#each events as event}
            <EventEditor {event} />
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