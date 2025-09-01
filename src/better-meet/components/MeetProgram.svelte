<script>
  export let meet;

  import { selectedEventStore } from '@src/stores';
  import ScrollBox from '@shared/components/ScrollBox.svelte';
  import SelectButtons from '@shared/components/SelectButtons.svelte';
    import MeetProgramEvent from './MeetProgramEvent.svelte';

  $: if (meet) {
    if(!meet.seeded) meet.seed();
  }

  let selectedEvent;
  // Function to update the selected event in the store
  function selectEvent(event) {
    selectedEventStore.set(event);
  }

  function eventButton(event) {
    return event.n + ') ' + event.ageGroup.name + '\n\n' + event.distance + ' ' + event.stroke.name;
  }

</script>

<div class="meet content-box">
  <ScrollBox width="8rem">
    <div class="button-column">
      <SelectButtons
        options={meet.events}
        selected={$selectedEvent}
        select={selectEvent}
        text={(event) => eventButton(event)}
      />
    </div>
  </ScrollBox>

  <div class="box">
    <ScrollBox>
      {#each meet.events as event}
        <MeetProgramEvent {meet} {event} />
      {/each}
    </ScrollBox>
  </div>
</div>

<style>
  /* Your existing styles */
  div.meet {
    display: flex;
    flex-direction: row;
    width: 80rem;
    height: calc(100vh - 10.5rem);
  }

  .button-column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.75rem;
    padding: 0.5rem;
    text-align: center;
    width: 7.5rem;
  }

  .box {
    background-color: var(--bg-color-1);
    width: calc(100% - 9.5rem);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    font-size: 0.875rem;
  }
</style>