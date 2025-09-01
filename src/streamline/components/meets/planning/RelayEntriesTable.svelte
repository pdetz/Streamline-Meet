<script>
    import RelayEntryRow from "./RelayEntryRow.svelte";
    import {selectedRelayEventStore} from '@src/stores';
    import { MY_TEAM } from "@src/stores";
    import { flip } from 'svelte/animate';
    import Relay from "@models/Relay";
    
    $: selectedRelayEvent = $selectedRelayEventStore;
    $: myTeam = $MY_TEAM;

    function updateRelay(relay, updatedRelay) {
      //console.log('updateRelay', relay, updatedRelay);
      relay.removeSwim(); // Remove the old relay from the event

      if (updatedRelay === null) {
        selectedRelayEventStore.set(selectedRelayEvent); // Update the store with the new relay list
        return; // If the updated relay is null, just return
      }

      relay = updatedRelay; // Update the relay with the edited one

      relay.selectedSwim = null; // Reset selected swim
      relay.selectedIndex = null; // Reset selected index

      relay.addRelay(); // Add the edited relay back to the event
      selectedRelayEventStore.set(selectedRelayEvent); // Update the store with the new relay list
    }

    function addEmptyRelay() {
      let newRelay = new Relay({event: selectedRelayEvent, team: myTeam, type: 'planning'});
      newRelay.addRelay(); // Add the new relay to the event
      //console.log(selectedRelayEvent.planning);
      selectedRelayEventStore.set(selectedRelayEvent); // Update the store with the new relay list
    }
</script>

<table class="list">
  <thead class='center'>
    <tr>
      <td class='controls'></td>
      <td class='team'>Team</td>
      <td class='athletes relay-planner' colspan='2'>Athletes</td>
      <td class='relay-planner time'>Time</td>
      <td class='points'>Pts</td>
      <td class='splits'>Fastest Splits</td>
    </tr>
  </thead>

  <tbody>
    {#each selectedRelayEvent.planning as relay (relay.key)}
      <tr animate:flip={{ duration: 500 }} class:my_team={relay.team.isMyTeam()}>
          
        <RelayEntryRow {relay} {updateRelay} />
      
      </tr>
    {/each}
      <tr>
        <td class = 'text-italic text-dark' colspan="7">
          See the tables below to add relay entries
          <button style='display:inline' class="sb tool" on:click={addEmptyRelay}>
            Add Empty Relay
          </button>
        </td>
      </tr>
  </tbody>
</table>

  <style>
    td.splits {
      padding: 0 0.5em;
      width: 18em;
      text-align: center;
    }
</style>