<script>
  export let closeModal;
  export let unavailableSwimmers = new Map(); // Assuming unavailableSwimmers is a Set or Map
  export let toggleAvailability;

  import ScrollBox from '@shared/components/ScrollBox.svelte';
  import { MY_TEAM, selectedMeetStore, selectedRelayEventStore } from '@src/stores';
  import Tile from '@shared/components/Tile.svelte';
  $: selectedRelayEvent = $selectedRelayEventStore;
  $: selectedMeet = $selectedMeetStore;
  $: myTeam = $MY_TEAM;

  $: availableSwimmers = calculateAvailableSwimmers(selectedMeet, selectedRelayEvent);

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function calculateAvailableSwimmers(meet, relayEvent) {
    let availableSwimmers = new Set();
    let relayAgeGroups = new Set(relayEvent.swimmers);

    for (const relayAgeGroup of relayAgeGroups) {
      const meetAgeGroup = meet.getMeetAgeGroup(relayAgeGroup);
      if (meetAgeGroup && meetAgeGroup.swimmers) {
        for (const swimmer of meetAgeGroup.swimmers) {
          if (swimmer.isMyTeam()) {
            availableSwimmers.add(swimmer);
          }
        }
      } else {
        console.warn(`Age group from relay event not found in meet: ${relayAgeGroup.id || relayAgeGroup}`);
      }
    }
    return availableSwimmers; // Returning the Set of unique swimmers
  }
</script>

<div class="modal-overlay" on:click={closeModal} role='presentation'>
    <div class="modal-content" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="0" on:keydown|stopPropagation={handleKeydown}>
        <Tile size={{ width: '100%', height: '100%' }}>
            <div slot="title">
                Make the following swimmers unavailable for <br>
                {selectedRelayEvent.name}
            </div>
                <ScrollBox width='18em'>
                    <div class="swimmers">
                      {#each availableSwimmers as swimmer (swimmer.key)}
                        <button class="sb swimmer my_team"
                            class:selected = {unavailableSwimmers.has(swimmer.key)}
                            on:click|stopPropagation={() => toggleAvailability(swimmer)}>
                              <span class="x">❌</span>{swimmer.display}
                        </button>
                      {/each}
                    </div>
                </ScrollBox>
            <div class="button-group">
                <button class="close" on:click={closeModal}>Close</button>
            </div>
        </Tile>
    </div>
</div>

<style>
  div.swimmers {
    background-color: var(--bg-color-2);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5em;
  }

  button.sb span.x {
    opacity: 0;
    margin-right: 1em;
  }

  button.sb.selected span.x {
    opacity: 1;
  }

  button.sb.swimmer {
    font-size: 0.9em;
    background-color: transparent;
    padding: 0.1em 0.2em;
    width: calc(100% - 1em);
    text-align: left;
  }
  button.sb.swimmer.my_team {
    color: var(--team-color);
  }

  button.sb.swimmer:hover {
    background-color: var(--bg-color-3);
  }
  button.sb.swimmer.selected {
    background-color: #400;
    color: #f44;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 1rem;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 99;
  }

  .modal-content {
    width: 27em;
    margin-top: 4rem;
    max-height: calc(100vh - 5rem);
    background: var(--bg-color-1);
    padding: 0;
    position: relative;
    text-align: center;
    z-index: 100;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .scrollbox-wrapper {
        flex-grow: 1; /* Make this element fill the available space within Tile's content */
        /* Ensure content scrolls within this wrapper if it overflows */
        overflow-y: auto;
        /* Optional: Add padding/margin if needed inside the wrapper */
        padding: 0 0.5em; /* Example: Add some horizontal padding */
        /* Set min-height to 0 to prevent flex item from preventing shrinking below content size */
        min-height: 0;
    }

  .button-group {
    display: flex;
    justify-content: space-around;
    margin: 0.5rem;
    gap: 1rem;
  }

  .button-group button {
    padding: 0.5rem 1rem;
    cursor: pointer;
    background-color: var(--bg-color-3);
    color: #ccc;
    border: 2px solid transparent;
    transition: border-color 0.3s;
  }

  .button-group button:hover {
    border-color: var(--border-color-hl);
  }
</style>