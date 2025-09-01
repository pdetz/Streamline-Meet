<script>
    import { EventsTemplate } from "@models/MeetTypes/EventsTemplate";
import { triggerRefresh, pointsStore } from "@src/stores";
    import { emailListStore, toggleSwimmerInEmailList } from "@src/stores";

    export let meet;
    export let swimmer;
    export let updateSwimmerPlan;

    $: emailList = $emailListStore; // Reactive declaration to get the latest email list
    $: email = emailList && emailList.includes(swimmer);

    function toggleSwimmerSelection() {
        toggleSwimmerInEmailList(swimmer);
    }

    let status; let ageGroups = [];
    const mc = swimmer.getMeetConfirmation(meet.objectId);
    $: meetComsUrl = mc && meet && meet.objectId ? `/coms?i=${mc.objectId}` : '#';

    $: if (meet && swimmer) {
        let swimmerPlan = meet.getMeetPlan().getSwimmerPlan(swimmer);
        status = swimmerPlan.status;
        if (swimmerPlan.ageGroups) {
            ageGroups = swimmerPlan.ageGroups.length > 0 ?
                swimmerPlan.ageGroups : [meet.swimmerBag(swimmer)];
        }
    }

    function selectStatus(newStatus) {
        status = newStatus;
        triggerRefresh(pointsStore);
        updateSwimmerPlan(swimmer, { status });
    }
</script>

<tr>
    <td class='slim attendance-name my-team'>
        <div class='swimmer'>
            <a href={meetComsUrl} target="_blank" rel="noopener noreferrer">
                <button class='sb inv swimmer'>            
                    {swimmer.display}
                </button>
            </a>
        </div>
    </td>
    <td class='slim attendance'>
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
    <td class='slim strokes'>
        {swimmer.getMeetConfirmation(meet.objectId)?.strokes?.length > 0
            ? swimmer.getMeetConfirmation(meet.objectId).strokes.join(', ')
            : ''}
        {#if status === 'Unconfirmed'}
            <button class='sb' class:tool={email} on:click={toggleSwimmerSelection}>
                Email
            </button>
        {/if}
    </td>
    <td class='slim swim-ups'>
        {#if meet && meet.objectId}
            {#if status === 'Present' && mc}
                {mc.notes}
            {:else if status === 'Unconfirmed'}
                {#each swimmer.parents as parent}
                    <div>
                        {parent.nombre} - 
                        {#if parent.phone}
                            <a href="tel:{parent.phone.replace(/\D/g, '')}">{parent.phone}</a>
                        {:else}
                            No phone
                        {/if}
                    </div>
                {/each}
            {/if}
        {/if}
    </td>
</tr>

<style>
    div.button-group {
        display: flex;
        gap: 0.5rem;
        height: 100%;
    }
    button.sb.inv.swimmer {
        text-align: left;
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

  button.sb.inv.email {
    background-color: #0af;
    color: #fff;
  }

  td.slim.attendance-name {
    padding-left: 0.25em;
    width: 14em;
    overflow: none;
  }
  td.strokes {
    text-align: center;
    width: 8em;
  }
  td.swim-ups {
    padding: 0.5em 0;
    width: 24em;
  }
  td.slim.swim-ups {
    padding: 0.1em;
    text-align: center;
  }
  a {
    text-decoration: none;
    color: var(--team-color);
  }
</style>