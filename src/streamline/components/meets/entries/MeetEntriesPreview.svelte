<script>
    import RelayEntries from "./RelayEntries.svelte";
    import EventEntries from "./EventEntries.svelte";

    export let meet;
    export let events;

    let normalizedEvents = [];
    $: if (Array.isArray(events)) {
        normalizedEvents = events;
    } else {
        normalizedEvents = [events];
    }

</script>

{#each normalizedEvents as event}
  {#if event.relay}
    <RelayEntries {meet} relayEvent={event}/>
  {:else}
    <EventEntries {meet} event={event}/>
  {/if}
{/each}