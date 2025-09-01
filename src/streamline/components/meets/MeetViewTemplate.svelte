<script>
  export let meet;

  import { selectedAgeGroupStore, selectedRelayEventStore } from '@src/stores';
  import ScrollBox from '@shared/components/ScrollBox.svelte';
  import SelectButtons from '@shared/components/SelectButtons.svelte';
  import ResultsTables from './ResultsTables.svelte';
  import PlanningTable from './planning/PlanningTable.svelte';
  import RelayPlanner from './planning/RelayPlanner.svelte';
  import MeetEntriesPreview from './entries/MeetEntriesPreview.svelte';

  let ageGroups;
  let events = [];
  let ViewComponent;
  let viewProps = {};
  let viewType;

  $: loadView(meet);
  $: chooseView($selectedAgeGroupStore, $selectedRelayEventStore);

  function selectAgeGroup(ageGroup) {
    selectedAgeGroupStore.set(ageGroup);
    selectedRelayEventStore.set(null);
    if (ageGroup) {
      events = ageGroup.eventIndices
          .map((n) => meet.events[n])
          .filter((event) => event.ageGroup.isEqualTo($selectedAgeGroupStore));
    }
  }

  function selectRelayEvent(relayEvent) {
    selectedRelayEventStore.set(relayEvent);
    selectedAgeGroupStore.set(null);
    events = [relayEvent];
  }

  function loadView(meet) {
    viewType = meet.view || 'planning';
    ageGroups = meet.ageGroups.filter(ag => ag.hasEvents())

    if ($selectedAgeGroupStore) {
      const matchingAgeGroup = meet.getMeetAgeGroup($selectedAgeGroupStore);
      //console.log('matchingAgeGroup', matchingAgeGroup);
      if (matchingAgeGroup) {
        selectAgeGroup(matchingAgeGroup);
      } else {
        selectAgeGroup(null);
      }
    } else if ($selectedRelayEventStore) {
        const matchingRelay = meet.relayEvents.find(
          (relayEvent) => relayEvent.isEqualTo($selectedRelayEventStore)
        );
        if (matchingRelay) {
          selectRelayEvent(matchingRelay);
        } else {
          selectRelayEvent(null);
        }
    }
  }

  function chooseView(ageGroup, relayEvent) {
    viewProps = { meet, events, ageGroup };
    if (viewType === 'results') {
      ViewComponent = ResultsTables;
    } else if (viewType === 'entries') {
      ViewComponent = MeetEntriesPreview;
      viewProps = { meet, events };
    } else {
      ViewComponent = relayEvent ?
        RelayPlanner : PlanningTable;
    }
  }
</script>

<ScrollBox width="8rem">
  <div class="button-column">
    <SelectButtons
      options={ageGroups}
      selected={$selectedAgeGroupStore}
      select={selectAgeGroup}
      text={(ageGroup) => ageGroup.name}
    />
    {#if meet.relayEvents}
      Relays:
      <SelectButtons
        options={meet.relayEvents}
        selected={$selectedRelayEventStore}
        select={selectRelayEvent}
        text={(relayEvent) => relayEvent.name}
      />
    {/if}
  </div>
</ScrollBox>

{#if $selectedAgeGroupStore || $selectedRelayEventStore}
  <div class="box">
    <ScrollBox>
      <svelte:component this={ViewComponent} {...viewProps} />
    </ScrollBox>
  </div>
{/if}

<style>
  /* Your existing styles */
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