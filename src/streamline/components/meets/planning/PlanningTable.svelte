<script>
  export let meet;
  export let ageGroup;
  export let isOfficial = false;

  import { selectedEventStore, pointsStore, triggerRefresh } from '@src/stores';
  import { compareTimes } from '@models/Swim';
  import SwimmerModal from './SwimmerModal.svelte';
  import PlanningRow from './PlanningRow.svelte';
  import { flip } from 'svelte/animate';
  import TeamsPoints from '@meets/TeamsPoints.svelte';
  import { clearEvents, fillEvents } from './fillEvents';

  let selectedSwimmer = null;
  let currentPointsTrigger = $pointsStore;

  $: meet.sortAllSwimmers();
  $: swimmers = ageGroup.swimmers;

  $: if ($selectedEventStore) {
    // Sort swimmers based on the selected event
    swimmers = swimmers.slice().sort((a, b) =>
      compareTimes(a.best($selectedEventStore), b.best($selectedEventStore))
    );
  } else {
    // Sort swimmers by team, then by apellido, then by nombre
    swimmers = swimmers.slice().sort((a, b) => {
      // Sort by team: isMyTeam() first
      if (a.team.isMyTeam() && !b.team.isMyTeam()) return -1;
      if (!a.team.isMyTeam() && b.team.isMyTeam()) return 1;

      // If teams are the same, sort by apellido (last name)
      if (a.team === b.team) return a.nameSort(b);

      // For other teams (if isMyTeam doesn't apply), maintain current grouping
      return a.team.abbr.localeCompare(b.team.abbr); // This ensures other teams remain grouped together.
    });
  }

  // Get relevant events for the age group
  $: events = ageGroup.eventIndices
    .map(n => meet.events[n])
    .filter(event => event.ageGroup.isEqualTo(ageGroup));
    
  $: if ($pointsStore !== currentPointsTrigger) {
    events = [...events];
    currentPointsTrigger = $pointsStore;
  }

  $: fillVisible = events.reduce((acc, event) => { return acc + event.maxEntries; }, 0) > 0;

  // Function to trigger reactivity for planning updates
  function updatePlanning() {
    meet.calculateScore('planning');
    triggerRefresh(pointsStore);
  }

  // Select event and update the store
  function selectEvent(event) {
    selectedEventStore.set(event);
  }

  function openModal(swimmer) {
    console.log('openModal', swimmer);
    selectedSwimmer = swimmer;
  }

  function closeModal(triggerUpdate) {
    if (triggerUpdate) {
      swimmers = [...ageGroup.swimmers]; // Ensure reactivity
      updatePlanning();
    }
    selectedSwimmer = null;
  }

  function fill_Events() {
    fillEvents(events);
  }
  function clear_Events() {
    clearEvents(events);
  }
</script>

{#if selectedSwimmer}
  <SwimmerModal 
    swimmer={selectedSwimmer} 
    {meet} 
    {closeModal} 
  />
{/if}

 <div class='sticky'>
  <div class='points'>
    <TeamsPoints {meet} viewType='planning' {ageGroup} text={`${ageGroup.name} Points: `} />

    {#if fillVisible}
      <button class="sb tool" on:click={() => fill_Events()}>
        <span class="icon">🏊</span>
        <span class="text">Fill</span>
      </button>
    {/if}
    <button class="sb tool" on:click={() => clear_Events()}>
      <span class="icon">❌🏊</span>
      <span class="text">Clear</span>
  </div>
<table class="list">
  <thead>
    <tr>
      <th class='name'>
        <button class="stroke" class:selected={!$selectedEventStore} on:click={() => selectEvent(null)}>
          Name
        </button>
      </th>
      <th class='team'>Team</th>
      {#each events as event}
        <th class="result">
          <button class={"stroke " + event.stroke.abbr}
                  class:selected={$selectedEventStore === event} 
                  on:click={() => selectEvent(event)}>
            {event.distance} {event.stroke.abbr}
          </button>
        </th>
      {/each}
    </tr>
  </thead>
  </table>
  </div>
  <table class="list">
    <tbody>
    {#each swimmers as swimmer (swimmer.key)}
      <tr animate:flip={{ duration: 500 }} class:my_team={swimmer.isMyTeam()}>
        <PlanningRow
          {swimmer}
          {events}
          {meet}
          {openModal}
          {updatePlanning}
          {isOfficial}
        />
      </tr>
    {/each}
  </tbody>
</table>

<style>
  div.sticky {
    position: sticky;
    top: 0;
    background-color: var(--bg-color-1);
    z-index: 1;
  }

  div.points {
    padding-bottom: 0.5rem;
  }

  button.sb.tool {
    margin-left: 1rem;
  }

  .stroke {
    background-color: transparent;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
  }
  .stroke:hover {
    border-color: var(--border-color-hl);
  }
  button.stroke:active {
    border-color: #fff;
  }
  .selected {
    color: var(--sel-text-color);
    background-color: var(--sel-color-2);
  }
</style> 