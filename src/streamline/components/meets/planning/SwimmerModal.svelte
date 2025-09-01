<script>
  export let swimmer;
  export let meet;
  export let closeModal; // Function to close the modal

  import Tile from '@shared/components/Tile.svelte';
  import AgeGroupSelector from './AgeGroupSelector.svelte';

  let status; let ageGroups = [];
  let triggerUpdate = false;

  $: if (meet && swimmer) {
    let swimmerPlan = meet.getMeetPlan().getSwimmerPlan(swimmer);
    status = swimmerPlan.status;
    ageGroups = swimmerPlan.ageGroups?.length > 0 ?
      swimmerPlan.ageGroups : [meet.swimmerBag(swimmer)];
  }

  function handleOutsideClick(event) {
    if (event.target === event.currentTarget) {
      closeModal(triggerUpdate);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal(triggerUpdate);
    } else if (event.key === 'Enter') {
      savePlan();
    }
  }

  function selectStatus(newStatus) {
    status = newStatus;
  }

  function selectAgeGroups(newAgeGroups) {
    ageGroups = [...newAgeGroups];
  }

  async function savePlan() {
    triggerUpdate = await meet.updateSwimmerPlan(swimmer, {ageGroups, status});
    closeModal(triggerUpdate);
  }

</script>

<svelte:window on:keydown={handleKeydown} on:click={handleOutsideClick} />

<div class="modal-overlay">
    <div class="modal-content">
        <Tile size={{ width: '24em' }}>
            <div slot="title">
                {swimmer.nombreApellido}
            </div>
                Meet: {meet.name}
                <div class="button-group">
                    <button class:present={status === 'Present'} on:click={() => selectStatus('Present')}>Present</button>
                    <button class:unconfirmed={status === 'Unconfirmed'} on:click={() => selectStatus('Unconfirmed')}>Unconfirmed</button>
                    <button class:absent={status === 'Absent'} on:click={() => selectStatus('Absent')}>Absent</button>
                </div>
                {#if meet.swimUps !== 'none'}
                  <AgeGroupSelector
                    {meet}
                    {swimmer} 
                    selectedAgeGroups={ageGroups} 
                    {selectAgeGroups}
                  />
                {/if}              
                <div class="button-group">
                    <button class="save" on:click={savePlan}>Save</button>
                    <button class="close" on:click={closeModal}>Close</button>
                </div>
        </Tile>
    </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
  }

  .modal-content {
    background: var(--bg-color-1);
    padding: 0;
    position: relative;
    text-align: center;
    z-index: 100;
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

  button.save {
    background-color: #6af;
    color: #000;
  }

  .button-group button:hover {
    border-color: var(--border-color-hl);
  }
</style>