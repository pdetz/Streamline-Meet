<script>
    //export let meet;
    export let relays = [];
    export let addEntry = () => {};
    export let type = 'seed';
    export let buttonText = 'Add Entry';
</script>

<table class="list">
    <thead class='center'>
        <tr>
        <td class='controls'></td>
        <td class='team'>Team</td>
        <td class='athletes relay-planner'>Athletes</td>
        <td class='relay-planner time'>Time</td>
        <td class='meet'>Meet</td>
        </tr>
    </thead>

    <tbody>
    {#each relays as relay}
        <tr class:my_team={relay.team.isMyTeam()}>
            <td class='controls'>
                <button class='sb tool' on:click={() => addEntry(relay)}>
                    {buttonText}
                </button>
            </td>
            <td class='team'>{relay.team.abbr}<br>{relay.label}</td>
            <td class='athletes relay-planner'>{relay.displaySwimmersShort()} </td>
            <td class='time relay-planner pad-right'>{relay.display(type)}</td>
            <td class='text-center'>
                {#if relay.meet.abbr === ''}
                    <div class='text-italic'>Based on best / estimated splits</div>
                {:else}
                    {relay.meet.name}
                {/if}
            </td>
        </tr>
    {/each}
    </tbody>
</table>

<style>
    button.sb.tool {
        background-color: transparent;
        padding: 0.2em;
        margin: 0;
    }

    td.meet {
        padding: 0 0.5em;
        width: calc(21em + 1px);
        text-align: center;
    }
</style>