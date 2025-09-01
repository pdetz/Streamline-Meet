<script>
  export let team;
  export let event;
  export let ageGroup;

  import { STROKES } from "@models/LeagueData";

  let swimmers = [];

  $: if (ageGroup) {
    swimmers = team.filterSwimmers(ageGroup);
    swimmers.sort((b, a) => percentImprovement(a, event) - percentImprovement(b, event));
    console.log(swimmers);
  }

  function percentImprovement(swimmer, event) {
    let first = swimmer.findEarliestSwim(event).result;
    let best = swimmer.best(event).result;
    let delta = first - best;
    return (delta / first) * 100;
  }
</script>

<p>{event.stroke.name}</p>
<table class="list">
  <tbody>
    <tr>
      <td>Athlete</td>
      <td>Age</td>
      {#each team.meets as meet}
        <td>{meet.abbr}</td>
      {/each}
      <td>% Imp.</td>
      <td>Points</td>
    </tr>
    {#each swimmers as swimmer}
      <tr class="swimmer">
        <td>{swimmer.display}</td>
        <td>{swimmer.age}</td>
        {#each team.meets as meet}
          <td class="time">{swimmer.findSwimByDate(event, meet.startDate).display()}</td>
        {/each}
        <td>
          {percentImprovement(swimmer, event).toFixed(1) + '%'}
        </td>
        <td>
          {swimmer.points()}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  tr.swimmer:hover td {
    background-color: var(--bg-color-hl);
    color: var(--team-color);
  }
</style>
