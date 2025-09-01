<script>
    import RelayLegPicker from './RelayLegPicker.svelte';
    import { NO_SWIM } from '@models/Swim';

    export let relay;
    export let updatedRelay;
    export let selectLeg;
    export let updateLeg;
    export let rowHeight = 'auto'; // Default height, children will update it
    export let updateHeight; // Function to update height in parent component

    let contentDiv;
    $: isMyTeam = relay.team.isMyTeam();

    $: if (relay && contentDiv) { // Re-measure if relay data changes
        updateHeight(contentDiv.scrollHeight);
    }

    function removeSwim(swim, index) {
        updateLeg(NO_SWIM, index, false); // Set the swim to NO_SWIM
    }
    
    let editingSwimIndex = -1;
    let newSeedTime = 0;

    function startEdit(swim, index) {
        editingSwimIndex = index;
        newSeedTime = swim.seed; // Initialize with current seed time
    }

    function saveSeedTime(swim, index) {
        editingSwimIndex = -1;
        swim.seed = parseFloat(newSeedTime);
        updateLeg(swim, index, false);
    }

    function cancelEdit() {
        editingSwimIndex = -1;
    }

</script>

<td class='team'>
    {relay.team.abbr}<br>{relay.label}
</td>

<td class='leg'>
    <div class='expandable-container' style:height={rowHeight}>
    {#each relay.event.legs as leg}
            <div class={'sb stroke selected ' + leg.stroke.abbr}>
                {leg.distance} {leg.stroke.abbr}
            </div>
    {/each}
    <div class='timeToBeat inv'> {relay.event.distance} </div>
    </div>
</td>

<td class='athletes'>
    <div class='expandable-container' style:height={rowHeight}>
    <div class='contentDiv' bind:this={contentDiv}>
        {#each updatedRelay.swims as swim, index}
            <button class='sb swim'
                class:my_team={isMyTeam}
                class:selected={index === updatedRelay.selectedIndex}
                on:click={() => selectLeg(swim, index)}>
                    <div class='n'>{swim.swimmer.display}</div>
                    <div class='remove'
                        on:click|stopPropagation={()=>removeSwim(swim, index)}>
                            x
                    </div>
            </button>
        {/each}
        <div class='timeToBeat'>
            Time to Beat:
        </div>
    </div>
    </div>
</td>

<td class="time relay-planner">
    <div class='expandable-container' style:height={rowHeight}>
        {#each updatedRelay.swims as swim, index}
            {#if editingSwimIndex === index}
                <div class="edit-seed-time">
                    <button class="small save" on:click={() => saveSeedTime(swim, index)}>✔</button>
                    <button class="small cancel" on:click={cancelEdit}>✖</button>
                    <input
                        type="text"
                        bind:value={newSeedTime}
                        on:keydown={(e) => {
                            if (e.key === 'Enter') saveSeedTime(swim, index);
                            if (e.key === 'Escape') cancelEdit();
                        }}
                    />
                </div>
            {:else}
                <button class='sb time text-right' on:click={() => startEdit(swim, index)}>
                    {swim.display('seed')}
                </button>
            {/if}
        {/each}
        <div class='timeToBeat'>{updatedRelay.display('seed')}</div>
    </div>
</td>

<td class='selectSwimmer' colspan="2">
    <div class='expandable-container splits' style:height={rowHeight}>
        <RelayLegPicker relay={updatedRelay} {updateLeg} />
    </div>
</td>

<style>
    input {
        border: 1px solid var(--text-color-1);
        background: none;
        color: var(--text-color-1);
        width: 4em;
        text-align: right;
    }
    button.small {
        width: 1em;
        padding: 0;
        background-color: transparent;
        border: none;
    }
    button.small.save {
        color: #0f0;
    }
    button.small.cancel {
        color: #f00;
    }
    button.small.save:hover {
        color: #000;
        background-color: #0f0;
    }
    button.small.cancel:hover {
        color: #000;
        background-color: #f00;
    }

    td.leg {
        width: 4em;
        text-align: center;
    }
    div.stroke {
        color: #000;
        padding: 0.2em;
        margin: 1px;
        vertical-align: bottom;
        font-size: 0.9em;
        font-weight: bold;
        width: 100%;
    }

    td.athletes {
        min-width: 13em;
        max-width: 13em;
    }

    button.sb {
        height: calc(1.2em + 4px);
    }
    button.sb {
        background: none;
        padding: 0.1em 0.2em;
        width: 100%;
        min-height: 1.5em;
        vertical-align: top; /* Add this line */
    }
    button.swim.sb {
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    button.time.sb.text-right {
        text-align: right;
    }
    
    button.swim.sb.selected {
        font-weight: normal;
        background-color: var(--sel-color-2);
    }
    
    button.swim.sb.my_team.selected {
        background-color: var(--team-color);
    }

    div.expandable-container.splits {
        flex-direction: row;
        justify-content: flex-end;
    }
    
    div.timeToBeat {
        width: 100%;
        text-align: right;
        padding: 0.4em 0.2em;
    }
    div.timeToBeat.inv{
        opacity: 0;
    }

    button.sb div {
        display: inline-block;
        height: 1.2em;
    }
    div.n {
        width: 11em;
        text-align: left;
        overflow: hidden;
    }
    div.remove {
        width: 1.8em;
        height: 1.5em; /* Ensure a defined height for vertical centering */
        display: flex; /* Use flexbox to center the 'x' inside this div */
        justify-content: center; /* Center horizontally */
        align-items: bottom; /* Center vertically */
        text-align: center; /* Redundant with justify-content: center, but can keep */
        font-size: 0.8em;
        font-weight: bold;
        color: #888;
        line-height: 1; /* Reset line-height as flexbox handles centering */
        padding: 0; /* Reset padding-top */
        margin-left: 5px; /* Add some spacing from the swimmer name */
    }
    
    button.selected div.remove {
        color: #000;
    }
    button.selected div.remove:hover, div.remove:hover {
        color: #fff;
        background-color: #c00;
        cursor: pointer;
    }
</style>