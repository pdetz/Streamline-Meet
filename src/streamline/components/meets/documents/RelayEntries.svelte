<script>
    export let meet;
    export let type = 'planning';
    import { MY_TEAM } from '@src/stores';

    $: myTeam = $MY_TEAM;
    let relayParticipants = []; // Initialize an empty array for relay participants

    $: {
        let tempRelayParticipants = new Map();
        meet.relayEvents.forEach(event => {
            event[type].forEach(relay => {
                // console.log('Processing relay:', relay.team, myTeam); // Keep for debugging if needed
                if (relay.team && myTeam && relay.team.abbr !== myTeam.abbr) return;
                relay.swims.forEach(swim => {
                    if (swim.swimmer) { // Ensure swimmer object exists
                        if (!tempRelayParticipants.has(swim.swimmer)) {
                            tempRelayParticipants.set(swim.swimmer, [swim]);
                        } else {
                            tempRelayParticipants.get(swim.swimmer).push(swim);
                        }
                    }
                });
            });
        });
        let sortedParticipants = Array.from(tempRelayParticipants.entries());

        sortedParticipants.sort((a, b) => {
            const swimmerA = a[0]; // The Swimmer object for the first entry
            const swimmerB = b[0]; // The Swimmer object for the second entry

            if (swimmerA && typeof swimmerA.nameSort === 'function') {
                return swimmerA.nameSort(swimmerB);
            }
            if (swimmerA && swimmerB && swimmerA.display && swimmerB.display) {
                return swimmerA.display.localeCompare(swimmerB.display);
            }
            return 0; // Default if comparison is not possible
        });
        relayParticipants = sortedParticipants; // Assign the sorted array to the reactive variable
    }
</script>

<div class="relay-participants-container">
{#each relayParticipants as [swimmer, swims]}
    <div>
        <table class='list stripe'>
        <thead>
            <tr>
                <td colspan="2">{swimmer.display}</td>
            </tr>
        </thead>
        <tbody>
            {#each swims as swim}
            <tr>
                <td class='event'>
                    {swim.event.name}
                </td>
                <td class="leg">
                    {swim.distance} {swim.stroke.abbr}
                </td>
            </tr>
            {/each}
        </tbody>
        </table>
    </div>
{/each}
</div>

<style>
    .relay-participants-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Always two columns */
        gap: 1.5em; /* Gap between cards */
    }
    table.list.stripe td.event {
        text-align: left;
        padding-left: 0.25rem;
        width: 21em;
    }
    td.leg {
        text-align: right;
        padding-left: 0.25rem;
        width: 4em;
    }
</style>