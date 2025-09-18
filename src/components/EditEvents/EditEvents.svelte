<script>
    import { appState } from '@src/state/state.svelte.js';
    import EventEditor from './EventEditor.svelte';

    let meet = $derived(appState.meet);
    let events = $derived(appState.meet.events);
    let name = $derived(appState.meet.name);

</script>

<div>
    {name}
    {#each events as event}
        <EventEditor {event} />
    {/each}
</div>