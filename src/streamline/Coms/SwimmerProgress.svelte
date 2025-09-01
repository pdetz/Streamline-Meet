<script>
    import Tile from "@shared/components/Tile.svelte";
    import { getSwims } from "./getSwims";
    import { onMount } from "svelte";
    import { numberToTime } from "@models/Swim";

    export let swimmerKey = '';
    export let nombre = '';
    export let apellido = '';
    export let preferredName = '';
    export let age = '';
    export let teamId = '';

    $: swimmerKey = `${nombre}${apellido}${age}`.toLowerCase();
    $: swimmer = {
        nombre,
        apellido,
        preferredName,
        age,
        teamId
    };

    let swims = []; // Initialize meets as an empty array

    onMount(async () => {
        console.log('Swimmer Progress Component Mounted');
        swims = await getSwims(swimmer);
        console.log('Swims fetched:', swims);
        
        let currentMeet = '';
        swims.forEach(swim => {
            if (swim.meet.abbr !== currentMeet) {
                currentMeet = swim.meet.abbr;
                swim.showMeet = true; // Show the meet header for the first swim of each meet
            } else {
                swim.showMeet = false; // Hide the meet header for subsequent swims in the same meet
            }
        });
    });
</script>

<div class="meet-confirmation-container">
    <Tile>
        <div slot='title' class='title'>
            Glenmont Gators 2025 Season Progress for {preferredName} {apellido}
        </div>
        <div>
            <table class="list">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Meet</th>
                        <th>Event</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {#each swims as swim}
                        <tr class={swim.event.stroke.abbr}>
                            <td class='date'>
                                {#if swim.showMeet}
                                    {swim.meet.startDate}
                                {/if}    
                            </td>
                            <td class='meet'>
                                {#if swim.showMeet}
                                    {swim.meet.name}
                                {/if}    
                            </td>
                            <td class='event'>{swim.event.name}</td>
                            <td class='time'>{numberToTime(swim.result)}</td>
                        </tr>
                    {/each}
            </table>
        </div>
    </Tile>
</div>

<style>
    td.date {
        width: 6em;
        color: var(--text-color-1);
    }
    td.meet {
        width: 10em;
        text-align: left;
        color: var(--text-color-1);
    }
    td.event {
        width: 16em;
        text-align: left;
    }
    div.title {
        padding: 0 0.5rem;
    }
    tr.FR {
        color: var(--FR);
    }
    tr.BR {
        color: var(--BR);
    }
    tr.BK {
        color: var(--BK);
    }
    tr.FL {
        color: var(--FL);
    }
    tr.IM {
        color: var(--IM);
    }
    .strokes {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border: 1px solid var(--border-color);
        padding: 0.5rem 1rem;
        max-width: 20em;
    }
    button.sb.FR {
        background-color: var(--FR);
        color: #000;
    }
    button.BR {
        background-color: var(--BR);
        color: #000;
    }
    button.BK {
        background-color: var(--BK);
        color: #000;
    }
    button.FL {
        background-color: var(--FL);
        color: #000;
    }
    button.IM {
        background-color: var(--IM);
        color: #000;
    }
    div.notes {
        text-align: left;
    }
</style>