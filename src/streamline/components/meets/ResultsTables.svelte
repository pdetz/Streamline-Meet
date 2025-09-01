<script>
    import RelayResultsTable from "./RelayResultsTable.svelte";
    import ResultsTable from "./ResultsTable.svelte";

    export let meet;
    export let events;
    export let cssClass = "list";
    export let selectedColors = ["transparent", "transparent"];
    export let visiblePointTotal = true;

    let normalizedEvents = [];
    $: if (Array.isArray(events)) {
        normalizedEvents = events;
    } else {
        normalizedEvents = [events];
    }
</script>

{#each normalizedEvents as event}
    {#if event.relay} 
        <RelayResultsTable {meet} relayEvent={event} {cssClass} {selectedColors} {visiblePointTotal}/>
    {:else}
        <ResultsTable {meet} {event} {cssClass} {selectedColors}  {visiblePointTotal}/>
    {/if}
{/each}