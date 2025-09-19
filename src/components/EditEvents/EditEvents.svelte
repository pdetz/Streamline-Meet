<script>
    import Event from '@shared/models/Event';
    import { STATE } from '@src/state/state.svelte.js';
    import EventEditor from './EventEditor.svelte';
    import { StatusEnum } from 'sib-api-v3-sdk/src/model/GetCampaignOverview';

    let meet = $derived(STATE.meet);
    let events = $derived.by(() => {
        console.log("Deriving events from events:", STATE.meet.events);
        return STATE.meet.events
    });
    let name = $derived.by(() => STATE.meet.name);

    function addEvent(eventData=STATE.meet.events[STATE.meet.events.length - 1]) {
        console.log("Adding event", eventData);
        let newEvent = {...eventData};
        newEvent.n = (newEvent?.n || 0) + 1;
        STATE.meet.events = [...STATE.meet.events, new Event(newEvent)];
        console.log(STATE.meet.events, events);
    }
</script>

<div>
    {name}
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