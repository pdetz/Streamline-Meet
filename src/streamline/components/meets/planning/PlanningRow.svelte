<script>
  import PlanningButton from './PlanningButton.svelte';
  import PredictPoints from '@meets/PredictPoints.svelte';

  export let swimmer;
  export let events;
  export let meet;
  export let updatePlanning;
  export let openModal;
  export let isOfficial = false;

  $: status = swimmer.getStatus(meet);
</script>

<td class="name">
        <button class = {"swimmer " + status}
            on:click={() => openModal(swimmer)}>
                <div class = 'name'>
                    {swimmer.display}
                    <span class='check'>&#10003;</span>
                </div>
        </button>
</td>
<td class='team'>{swimmer.team.abbr}</td>
{#each events as event}
  <td class="result">
    {#if status === 'Absent'}
      <span class={'swimmer Absent'}>{swimmer.displayBest(event, isOfficial)}</span>
    {:else}
        <PlanningButton 
            {swimmer}
            {event}
            updatePlanning={updatePlanning}
        />
    {/if}

  </td>
  <td class="pts">
    <PredictPoints 
      {swimmer} 
      {event} 
      type="planning" 
    />
  </td>
{/each}

<style>

   div.name {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button.swimmer {
    color: inherit;
    background-color: transparent;
    border: none;
    width: 100%;
    height: 100%;
    cursor: pointer;
    text-align: left;
    padding: 0 0.25rem;
  }

  .swimmer.Absent {
    font-style: italic;
    filter: brightness(0.6);
    padding-right: calc(0.5rem + 2px);
  }

  button.swimmer:hover {
    background-color: var(--bg-color-hl);
    filter: brightness(1);
  }

  td.pts {
    width: 1.8em;
    text-align: right;
    padding-right: 0.3em;
  }

  button.swimmer span.check {
    font-size: 1rem;
    margin-right: 0.2rem;
  }

  button.swimmer.Present span.check {
    color: #0d0;
  }

  button.swimmer span.check {
    color: transparent;
  }

</style>
