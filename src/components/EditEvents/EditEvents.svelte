<script>
    import { STATE } from '@src/state/state.svelte.js';
    import EventEditor from './EventEditor.svelte';
    import { EventsTemplate } from '@src/shared/models/MeetTypes/EventsTemplate';
    import Meet from '@src/shared/models/Meet';
    import { MeetType } from '@src/shared/models/MeetTypes/MeetType';

    let events = $derived([...STATE.meet.type.eventsTemplate.events]);
    let lastEvent = $derived(events[events.length - 1]);

    function addEvent(eventData=lastEvent) {
        console.log("Adding event", eventData);
        let newEvent = {
            ...eventData,
            ages: [...eventData?.ages] || [0, 109],
            n: (eventData?.n || 0) + 1,
        };
        //STATE.meet.type.eventsTemplate.events.push(newEvent);
        events = [...events, newEvent];
    }

    function saveEvents() {
        const newEventsTemplate = new EventsTemplate({
            events: events.map((e, i) => {
                return {
                    ...e, 
                    stroke: e.stroke.sd3
                };
            })
        });
        const newMeetType = new MeetType({
            ...STATE.meet.type,
            eventsTemplate: newEventsTemplate
        });
        STATE.meet.type = newMeetType;
        STATE.meet.initializeAgeGroupsAndEvents();
        console.log("Saved events to meet", STATE.meet.events);
    }
</script>

<div>
    {STATE.meet.name}
    <button class='sb tool save-events' onclick={() => saveEvents()}>Save Events</button>
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