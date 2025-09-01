<script>
    import { tick } from 'svelte';
    import Relay from '@models/Relay';
    import RelayModifyEntryRow from './RelayModifyEntryRow.svelte';
    import RelayShowEntryRow from './RelayShowEntryRow.svelte';

    export let relay;
    export let updateRelay;
    let controlTd;
    let updatedRelay = false;
    let rowHeight = 'auto'; // Default height, children will update it
    let minRowHeight = 'auto'; // Default height, children will update it

    $: if (controlTd) minRowHeight = parseFloat(getComputedStyle(controlTd).fontSize) * 3.5;
    async function updateHeight(newHeight) {
        await tick(); // Wait for DOM to settle after updates
        rowHeight = newHeight > minRowHeight ? `${newHeight}px` : `${minRowHeight}px`;
    }
    
    function selectLeg(swim, index) {
        updatedRelay.selectedSwim = swim;
        updatedRelay.selectedIndex = index;
        console.log(swim);
    }

    function updateLeg(newSwim, index, updateSelectedSwim=true) {
        updatedRelay.swims[index] = newSwim;
        newSwim.event = relay.event;
        if (updateSelectedSwim) updatedRelay.selectedSwim = newSwim;
        updatedRelay.updateTime();
    }

    async function editRelay() {
        updatedRelay = new Relay({...relay});
        updatedRelay.swims = [...relay.swims];
        updatedRelay.selectedSwim = null;
        updatedRelay.selectedIndex = null;
    }

    function revertRelay() {
        if (updatedRelay.selectedIndex === null) return;
        updatedRelay.swims = [...relay.swims];
        updatedRelay.selectedSwim = updatedRelay.swims[updatedRelay.selectedIndex];
        console.log('revertRelay', updatedRelay.selectedSwim, updatedRelay.selectedIndex);
        updatedRelay.updateTime();
    }

    function saveRelay() {
        updateRelay(relay, updatedRelay);
        updatedRelay = false;
    }

    function removeRelay() {
        updateRelay(relay, null);
    }
</script>

<td class='controls'>
    <div class="expandable-container" style:height={rowHeight} bind:this={controlTd}>
        {#if updatedRelay}
            <button class='sb tool' on:click={saveRelay}>
                Save
            </button>
            <button class='sb tool' on:click={revertRelay}>
                Revert
            </button>
            <button class='sb tool' on:click={removeRelay}>
                Remove
            </button>
        {:else}
            <button class='sb tool' on:click={editRelay}>
                Edit
            </button>
            <button class='sb tool' on:click={removeRelay}>
                Remove
            </button>
        {/if}
    </div>
</td>

{#if updatedRelay}
    <RelayModifyEntryRow
        {relay}
        {updatedRelay}
        {selectLeg}
        {updateLeg}
        {rowHeight}
        {updateHeight}
    />
{:else}
    <RelayShowEntryRow
        {relay}
        {rowHeight}
        {updateHeight}
    />
{/if}

<style>
    button.sb {
        height: calc(1.4em + 4px);
    }
    button.sb {
        background: none;
        padding: 0.1em 0.2em;
        width: 100%;
        vertical-align: top; /* Add this line */
    }
    button.sb.tool{
        background-color: transparent;
        padding: 0;
    }

    button.tool {
        background-color: transparent;
        font-size: 1em;
        padding: 0.2em 0.5em;
        margin: 0;
        color: var(--text-color-1);
    }
</style>