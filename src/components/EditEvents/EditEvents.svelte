<script>
    import Event from '@shared/models/Event';
    import { STATE, addEventToMeet } from '@src/state/state.svelte.js';
    import EventEditor from './EventEditor.svelte';

    let meet = $derived(STATE.meet);
    let events = $derived(STATE.meet.events);
    let name = $derived(STATE.meet.name);

    function addEvent(eventData=STATE.meet.events[STATE.meet.events.length - 1]) {
        console.log("Adding event", eventData);
        let newEvent = new Event({
            ...eventData,
            n: (eventData?.n || 0) + 1,
        });
        addEventToMeet(newEvent);
        events = STATE.meet.events; // Trigger reactivity
        console.log(STATE.meet.events, events);
    }
</script>

<div>
    {name}
    <div class = 'events'>
        {#each events as event (event.key)}
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