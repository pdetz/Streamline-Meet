<script>
    import { onMount, onDestroy } from 'svelte';
    import Parse from 'parse/dist/parse.min.js';
    import { subscribeToQuery } from "./liveQueryService";
    import { numberToTime } from '@models/Swim';

    let results = [];
    $: resultsSorted = results.sort((a, b) => a.result - b.result);
    
    // This variable will hold our subscription object so we can unsubscribe later.
    let subscription;

    onMount(async () => {
        //initializeParse();
        const MeetResult = Parse.Object.extend('MeetResult');
        const query = new Parse.Query(MeetResult);
        subscription = await subscribeToQuery(query, {
            create: handleCreate,
            update: handleUpdate
        });
    });

    onDestroy(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
    
    function handleCreate(newObject) {
        results = [...results, newObject];
    }

    function handleUpdate(updatedObject) {
        const existingIndex = results.findIndex(r => r.objectId === updatedObject.objectId);
        if (existingIndex > -1) {
            results[existingIndex] = updatedObject;
        } else {
            results = [...results, newObject];
        }
    }
</script>

<div class='results'>
    {#if resultsSorted.length === 0}
        <div>No results yet.</div>
    {/if}
    {#each resultsSorted as result, index}
        <div>
            <strong>{index + 1}.</strong> {numberToTime(result.result)} (sd: {result.sd100.toFixed(2)})
        </div>
    {/each}
</div>

<style>
    .results {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Arial, sans-serif;
        color: #fff;
        padding: 1em;
    }
</style>