<script>
    export let swimmer;
    export let selectedColors = ['#fff', '#fff'];

    import { userStore } from "@src/stores";
    import { formatMMDDYYYToShortDate } from "@models/cleanData";
    import { STROKES } from "@models/LeagueData";
    import { numberToTime } from "@models/Swim";

    $: icon = $userStore.emojis[0];

    const swimmerResults = STROKES.slice(1, 6).flatMap(stroke => {
        return swimmer.results.filter(result => result.stroke.abbr === stroke.abbr)
                .filter(result => !result.event.relay)
                .filter(result => result.result < 9990)
                .sort((a, b) => b.event.distance - a.event.distance)
                .sort((a, b) => a.result - b.result)
    });
</script>

<div class="swimmer-results">
    <div class='title'>
        <img src="/gator.svg" alt="alligator" class="emoji-img" /><img src="/gator.svg" alt="alligator" class="emoji-img" /><img src="/gator.svg" alt="alligator" class="emoji-img" /><span class='name'> {swimmer.preferredName} {swimmer.apellido}</span><img src="/gator.svg" alt="alligator" class="emoji-img" /><img src="/gator.svg" alt="alligator" class="emoji-img" /><img src="/gator.svg" alt="alligator" class="emoji-img" />
    </div>
    <div class='team'> Glenmont Gators 2025 Season</div>
    <table class='stripe'>
        <thead>
            <tr>
                <td>Time</td>
                <td>Event</td>
                <td>Date</td>
                <td>Meet</td>
            </tr>
        </thead>
        <tbody>
            {#each swimmerResults as result}
                <tr>
                    <td class='result'>{numberToTime(result.result)}</td>
                    <td class='event'>
                        <span class='distance'>{result.event.distance}M</span> 
                        <span class='stroke'>{result.stroke.name}</span>
                    </td>
                    <td class='date'>{formatMMDDYYYToShortDate(result.date)}</td>
                    <td class='meet'>{result.meet.name}</td>
                </tr>
            {/each}
    </table>
</div>

<style>
    div.title {
        font-size: 1.5em;
        font-weight: bold;
        color: var(--primary-color);
        text-align: center;
        width: 100%;
    }

    span.name {
        padding: 0 2em;
    }
    
    div.team {
        padding: 0.5em;
        font-size: 1.2em;
        text-align: center;
        width: 100%;
        margin-bottom: 2em;
    }

    .swimmer-results {
        margin-bottom: 1em;
    }
    td.event {
        width: 22em;
        text-align: center;
    }
    span.distance {
        width: 48%;
        text-align: right;
        display: inline-block;
    }
    span.stroke {
        width: 48%;
        text-align: left;
        display: inline-block;
    }

    td.date {
        text-align: right;
    }
    td.meet {
        text-align: left;
        padding-left: 1.5em;
    }

    @media print {
        .swimmer-results {
            page-break-inside: avoid;
            page-break-after: always;
        }
    }
</style>