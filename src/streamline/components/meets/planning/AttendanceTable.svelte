<script>
    import { all } from "axios";
    import AttendanceRow from "./AttendanceRow.svelte";
    import { MY_TEAM, emailListStore } from "@src/stores";

    export let meet;
    export let swimmers = [];

    $: meetPlan = meet ? meet.getMeetPlan() : null;
    $: emailList = $emailListStore;
    
    let status = 'Unconfirmed';
    $: if (meet) {
        meetPlan = meet.getMeetPlan();
        updateSwimmers();
    }
    
    let allSelected = false;
    $: allSelected = emailList.length === swimmers.length;

    function selectStatus(newStatus) {
        status = newStatus;
        updateSwimmers();
    }

    function updateSwimmers() {
        swimmers = $MY_TEAM.swimmers
            .sort((a, b) => a.nameSort(b));
        swimmers = swimmers.filter(swimmer => {
            const swimmerPlan = meetPlan.getSwimmerPlan(swimmer);
            return swimmerPlan && swimmerPlan.status === status;
        });
    }

    async function updateSwimmerPlan(swimmer, updatedPlan) {
        await meet.updateSwimmerPlan(swimmer, updatedPlan);
        updateSwimmers();
    }

    function selectAllUnconfirmed() {
        if (allSelected) {
            emailListStore.set([]);
            swimmers = [...swimmers];
            console.log('Deselecting all swimmers');
            return;
        }
        swimmers.forEach(swimmer => {
            if (!swimmer.getMeetConfirmation(meet.objectId)) {
                console.log('No confirmation for swimmer:', swimmer);
                return;
            }
            if (swimmer.getMeetConfirmation(meet.objectId).attending === null) {
                emailList.push(swimmer);
            }
        });
        emailListStore.set([...new Set(emailList)]); // Ensure unique entries
        swimmers = [...swimmers]; // Trigger reactivity
    }
</script>

<div class='attendance-table'>
    <table class="list">
        <thead class='sticky'>
            <tr>
                <td class='swimmers'>{swimmers.length} {status}</td>
                <td class='Attendance'>
                    <div class='button-group'>
                        <button class='sb' class:present={status === 'Present'}
                            on:click={() => selectStatus('Present')}>
                                ✔
                        </button>
                        <button class='sb' class:unconfirmed={status === 'Unconfirmed' }
                            on:click={() => selectStatus('Unconfirmed')}>
                                ?
                        </button>
                        <button class='sb' class:absent={status === 'Absent'}
                            on:click={() => selectStatus('Absent')}>
                                X
                        </button>
                    </div>
                </td>
                <td class='strokes'>
                    {#if status === 'Unconfirmed'}
                        <button class='sb inv' on:click={selectAllUnconfirmed}>
                            {#if allSelected}
                                Deselect All
                            {:else}
                                Select All
                            {/if}
                        </button>
                    {:else}
                        Strokes
                    {/if}
                </td>
                <td class='swim-ups'>
                    {#if status === 'Unconfirmed'}
                        Contact Information
                    {:else}
                        Parent Notes
                    {/if}
                </td>
            </tr>
        </thead>
        <tbody>
            {#each swimmers as swimmer (swimmer.key)}
                <AttendanceRow {swimmer} {meet} {updateSwimmerPlan} />
            {/each}
    </table>

            {#each swimmers as swimmer}
    {#each swimmer.parents as parent}
        {parent.email}<br>
        {/each}
        {/each}
</div>

<style>
    .attendance-table {
        background-color: var(--bg-color-1);
        padding: 0.5rem;
        font-size: 0.8rem;
    }
    thead.sticky {
        font-weight: normal;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    td.swimmers {
        text-align: left;
    }
    td.strokes {
        text-align: center;
        width: 8em;
    }
    .button-group button.sb {
        font-size: 0.9rem;
        font-weight: bold;
        color: #aaa;
        padding: 0 0.3em;
        width: 1.6rem;
        background-color: transparent;
    }
  .button-group button.present {
    background-color: #0f4;
    color: #000;
  }

  .button-group button.absent {
    background-color: #f40;
    color: #000;
  }

  .button-group button.unconfirmed {
    background-color: #fd0;
    color: #000;
  }
</style>