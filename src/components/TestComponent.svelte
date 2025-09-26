<script>
    import { TEST1, TEST2 } from '@src/state/state.svelte.js';
    import Meet from '@shared/models/Meet';

    console.log("TEST1", TEST1.meet);

    let events1 = $derived(TEST1.meet.type.eventsTemplate.events);
    let events2 = $derived(TEST2.meet.type.eventsTemplate.events);

    function addEvent() {
        const newEvent = {
            n: events2.length + 1,
            distance: 100,
            stroke: 'Freestyle'
        };
        TEST1.meet.type.eventsTemplate.events.push(newEvent);
        TEST2.meet.type.eventsTemplate.events.push(newEvent);
        console.log("Events after adding", TEST1.meet.type.eventsTemplate.events);
    }
</script>

<div>
    {TEST2.meet.name}
    <button class='sb tool new-event'
        onclick={() => addEvent()}>+ New Event
    </button>

    <h3>EVENTS 1</h3>
    <div class = 'events'>
        {#each events1 as event, index}
            <div>
                Event {event.n} - {event.distance} {event.stroke}
            </div>
        {/each}
    </div>
    <h3>EVENTS 2</h3>
    <div class = 'events'>
        {#each events2 as event, index}
            <div>
                Event {event.n} - {event.distance} {event.stroke}
            </div>
        {/each}
    </div>
</div>