<script>
  import { onMount } from 'svelte';
  import { selectedMeetStore, MY_DIVISION, MY_TEAM, userStore, updateMeetViewStore } from '@src/stores';
  import SelectButtons from '@shared/components/SelectButtons.svelte';
  import { loadData } from '@data/LoadData';

  export let selectTeamOrDivision;
  export let teamOrDivision;
  export let meets;

  $: MyDivision = $MY_DIVISION;
  $: MyTeam = $MY_TEAM;
  $: selectedMeet = $selectedMeetStore;

  function selectMeet(meet) {
    console.log('Selected Meet:', meet);
    updateMeetViewStore(meet, meet ? meet.view : null);
  }

  onMount(async () => {
    teamOrDivision = MyTeam || MyDivision;
    meets = teamOrDivision ? teamOrDivision.meets || [] : [];
    if (!teamOrDivision) {
      await loadData($userStore);
      console.error('No team or division selected. Please select a team or division first.');
    }
  });

</script>

{#if teamOrDivision}
<div class="sidebar">
  <button class="sb" on:click={() => selectMeet(null)}>
    ↩ Back
  </button>

  <div class='tOrD'>
    <SelectButtons 
      options={[MyTeam, MyDivision]} 
      selected={teamOrDivision} 
      select={selectTeamOrDivision} 
      text={(obj) => {
        return obj === MyTeam ? `${obj.name}` : `Division ${obj.name}`}
      }
    />
  </div>

  <SelectButtons 
    options={meets} 
    selected={selectedMeet} 
    select={selectMeet} 
    text={(meet) => `${meet.abbr}`}
  />
</div>
{/if}

<style>
  .sidebar {
    height: 100%;
    background-color: var(--bg-color-1);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tOrD {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--bg-color-3);
    padding: 0.5rem;
  }
</style>