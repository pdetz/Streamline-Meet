<script>
    // ... any script
  import { MY_TEAM, selectedAgeGroupStore } from "@src/stores";
  import SelectButtons from '@shared/components/SelectButtons.svelte';
  import ImprovementsTable from "../ImprovementsTable.svelte";
  import { MCSL_MEETS } from '@models/MeetTypes/MeetType';
    import ScrollBox from "@shared/components/ScrollBox.svelte";

  let selectedAgeGroup;
  $: selectedAgeGroup = $selectedAgeGroupStore;
  
  $: MyTeam = $MY_TEAM;
  
  let events = [];

function selectAgeGroup(ageGroup) {
    selectedAgeGroupStore.set(ageGroup);
  }

  $: if (selectedAgeGroup) {
    let evs = [];
    MCSL_MEETS.A.events.forEach(event => {
      if (event.ageGroup.name === selectedAgeGroup.name) {
        evs.push(event);
      }
    });
    events = evs;
  }
</script>
  


<div class="meet content-box">

  <div class="button-column">
    <SelectButtons 
      options={MCSL_MEETS.A.ageGroups} 
      selected={selectedAgeGroup} 
      select={selectAgeGroup} 
      text={(ageGroup) => ageGroup.name}
    />
  </div>

  <div class="box">
    <ScrollBox>
      {#each events as event}
        <ImprovementsTable 
          team={MyTeam}
          event={event}
          ageGroup={selectedAgeGroup}
        />
      {/each}
    </ScrollBox>
  </div>
</div>



  <style>
    .button-column {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.75rem;
      width: 5rem;
    }

    div.meet {
      display: flex;
      flex-direction: row;
      width: 80rem;
    height: calc(100% - 6rem);
    }

    .box {
      background-color: var(--bg-color-1);
      width: 80 rem;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      margin-left: 1rem;
      font-size: 0.875rem;
    }
  </style>