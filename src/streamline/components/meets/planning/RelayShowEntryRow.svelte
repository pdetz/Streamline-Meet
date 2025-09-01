<script>
    import { onMount } from 'svelte';
    export let relay;
    export let rowHeight = 'auto'; // Default height, children will update it
    export let updateHeight; // Function to update height in parent component

    let contentDiv;

    $: if (relay && contentDiv) { // Re-measure if relay data changes
        updateHeight(contentDiv.scrollHeight);
    }
</script>

<td class='team'>
    {relay.team.abbr}<br>{relay.label}
</td>

<td class='athletes relay-planner' colspan='2'>
    <div class='expandable-container' style:height={rowHeight}>
    <div class='contentDiv' bind:this={contentDiv}>
        {relay.displaySwimmersShort()}
    </div>
    </div>
</td>

<td class="time pad-right">
    {relay.display('seed')}
</td>

<td class='points'>
    {#if relay.points > 0} {relay.points} {/if}
</td>

<td class='selectSwimmer'>
    <div class='best-estimated'>Click 'Edit' to modify relay</div>
</td>

<style>
    div.contentDiv {
        width: 100%;
        text-align: left;
    }
    div.best-estimated {
        font-style: italic;
        width: 100%;
        text-align: center;
        opacity: 0.5;
    }
</style>