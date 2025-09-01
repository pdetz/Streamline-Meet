<script>
    export let meet;
    export let swimmer;
    export let className = 'column';
    export let buttonClass = '';
    export let showSwimUpRules = true;
    export let selectAgeGroups = () => {};
    export let selectedAgeGroups=[];
    import { SWIM_UP_RULES } from '@models/LeagueData';

  let swimUpAgeGroups = [meet.swimmerBag(swimmer), 
    ...meet.ageGroups.filter(ag => 
      (ag.gender === 'X' || ag.gender === swimmer.gender) && 
      ag.ages[0] > swimmer.age)
  ];

  $: newAgeGroups = [...selectedAgeGroups];
    
  function selectAgeGroup(ageGroup) {
    if (newAgeGroups.includes(ageGroup)) {
      newAgeGroups = selectedAgeGroups.filter(ag => ag !== ageGroup);
      if (newAgeGroups.length === 0) newAgeGroups = [ageGroup];
    } else {
      if (meet.swimUps === 'Strict') {
        newAgeGroups = [ageGroup];
      } else {
        newAgeGroups = [...selectedAgeGroups, ageGroup].sort((a, b) => {
          return a.ages[1] - b.ages[1]
        });
      }
    }
    //console.log('newAgeGroups', newAgeGroups.map(ag => ag.name));
    selectAgeGroups(newAgeGroups);
  }
</script>

<div class = 'flex-row'>
  {#if showSwimUpRules}
    <div class ='column description'>
        <div class='bold'>
          {meet.swimUps} swim up rules: <br>
        </div>
        <div>
          {SWIM_UP_RULES[meet.swimUps]}
        </div>
    </div>
  {/if}
  <div class = {'age-groups ' + className}>
    {#each swimUpAgeGroups as ageGroup (ageGroup.name)}
      <button class={buttonClass + (newAgeGroups.includes(ageGroup) ? ' sb selected' : ' sb')}
        on:click={() => selectAgeGroup(ageGroup)}>
          {ageGroup.ageString}
      </button>
    {/each}
  </div>
</div>

<style>
  .flex-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-color-1);
  }

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
  }

  button.slim {
    padding: 0.1rem 0.5rem;
  }

  button.sb {
    background: none;
  }

  button.sb.selected {
    background-color: var(--sel-color-2);
    color: #000;
  }

  .description {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  .bold {
    font-weight: bold;
    text-decoration: underline;
  }
</style>