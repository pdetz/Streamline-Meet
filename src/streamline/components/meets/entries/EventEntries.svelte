<script>
    import TeamsPoints from "../TeamsPoints.svelte";

    export let meet;
    export let event;
</script>

<p>{event.name} <TeamsPoints {meet} swims={event.entries}/></p>
<table class="list">
    <thead>
        <tr>
        <td>Lane</td>
        <td>Athlete</td>
        <td>Age</td>
        <td>Team</td>
        <td>Seed</td>
        <td>Points</td>
        </tr>
    </thead>
    <tbody>
        {#each event.entries as swim}
        <tr class:my_team={swim.swimmer.isMyTeam()}>
            <td></td>
            <td>{swim.swimmer.resultsDisplay}</td>
            <td>{swim.swimmer.age}</td>
            <td>{swim.swimmer.team.abbr}</td>
            <td class="time">{swim.display('seed')}</td>
            <td>
            {#if swim.points > 0}
                {swim.points}
            {/if}
            </td>
        </tr>
        {/each}
    </tbody>
</table>