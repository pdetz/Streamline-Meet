<script>
  export let meet; // The meet object to update
  export let discrepancy; // The Discrepancy instance

  import SelectButtons from "@shared/components/SelectButtons.svelte";
  import { MEET_PROPS } from '@models/Meet';
  import { MEET } from '@src/stores';
  import Meet from '@models/Meet';

  // Initialize selected to have the same keys as discrepancy.discrepancies with values of null
  let selected = Object.keys(discrepancy.discrepancies).reduce((acc, prop) => {
    acc[prop] = null;
    return acc;
  }, {});

  // Function to handle selection
  function selectOption(prop, option) {
    selected[prop] = option; // Update selected object for the given discrepancy property
    console.log(selected); // Debugging
  }

  function resolveDiscrepancies(){
    MEET.set(discrepancy.resolveDiscrepancies(selected, Meet));
    console.log($MEET);
  }

  // Reactive variable to track if all selections are made
  $: allSelected = Object.values(selected).every(value => value !== null);

</script>

<div class="discrepancies-container">
  <h2>Discrepancies</h2>
    <table>
      {#each Object.entries(discrepancy.discrepancies) as [prop]}
        <tr>
          <td>{MEET_PROPS[prop]}</td>
          <td class="select">
            <SelectButtons
              options={discrepancy.discrepancies[prop]} 
              selected={selected[prop]} 
              select={(option) => selectOption(prop, option)}
              text={(option) => option}
            />
          </td>
        </tr>
      {/each}
    </table>
  {#if allSelected}
    <button class='sb' on:click={resolveDiscrepancies}>
      Continue
    </button>
  {/if}
</div>

<style>
  .discrepancies-container {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 1rem;
  }

  td.select {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
</style>