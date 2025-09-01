<script>
    export let meet;
    export let ageGroup = false;
    export let swims = false;
    export let viewType = 'results';
    export let prop = 'abbr';
    export let text = '';
    import { pointsStore } from "@src/stores";

    let points = [];
    $: if (viewType !== 'planning' && viewType !== 'entries') viewType = 'results';

    let showPoints = 0;
    $: if (meet) showPoints = meet.points.reduce((a, c) => a + c, 0) + meet.relayPoints.reduce((a, c) => a + c, 0);
    
    $: if (showPoints && $pointsStore) points = meet[viewType + 'Score'];
    $: if (showPoints && ageGroup && $pointsStore) {
        let swims = ageGroup.eventIndices.map(n => meet.events[n])
            .filter(event => event.ageGroup.isEqualTo(ageGroup))
            .reduce((acc, event) => acc.concat(event[viewType]), []);
        points = meet.tallyPoints(swims);
        //console.log(showPoints, 'swims', swims);
    }
    $: if (showPoints && swims) {
        points = meet.tallyPoints(swims);
    }

</script>

{#if showPoints}
    <span class='box'>
        {text}
        {#each meet.teams as team, index}
            <span class="points" class:my_team={team.isMyTeam()}>{team[prop]}: {Math.round(points[index]*100)/100}</span>
        {/each}
    </span>
{/if}

<style>
    .box {
        padding-bottom: 0.5em;
    }
    .my_team, .points.my_team {
        color: var(--team-color);
    }
    .points {
        margin-left: 1rem;
        color: #999;
    }
</style>