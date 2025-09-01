<script>
    import TeamsPoints from "./TeamsPoints.svelte";
    export let meet;
    export let event;
    export let cssClass = "";
    export let selectedColors = ['transparent', 'transparent'];
    export let visiblePointTotal = true;
</script>
  
<div class="resultsTable">
  <div class={"eventName " + cssClass}>
    {event.name} 
    {#if visiblePointTotal}
      <TeamsPoints {meet} swims={event.results} />
    {/if}
  </div>

  <table class={"list " + cssClass}>
    <thead class='center'>
      <tr>
        <td class='thead-athlete' colspan="2">Athlete</td>
        <td class="age">Age</td>
        <td class="team">Team</td>
        <td class="time">Seed</td>
        <td class="time">Final</td>
        <td class="points">Pts</td>
      </tr>
      </thead>
    <tbody>
      {#each event.results as swim}
        <tr class:my_team={swim.swimmer.isMyTeam()}>
          <td class="place">{swim.place}</td>
          <td class="name">
            {swim.swimmer.resultsDisplay}
          </td>
          <td class="age">{swim.swimmer.age}</td>
          <td class="team">{swim.swimmer.team.abbr}</td>
          <td class="time">{swim.display('seed')}</td>
          <td class="time">{swim.display()}</td>
          <td class="points">
            {#if swim.points > 0}
              {swim.points}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  div.eventName {
    font-size: 0.9em;
    padding-bottom: 0.25em;
    text-align: left;
  }

  div.eventName.list {
    font-size: 1em;
    margin-top: 1em;
  }
  
  div.eventName.stripe {
    font-weight: bold;
  }

  td.name {
    min-width: 12em;
    max-width: 12em;
  }
  td.age {
    width: 2.5em;
    text-align: center;
  }

  table.stripe td.name {
    min-width: 9em;
    max-width: 9em;
  }
  @media print {
    div.resultsTable {
      break-inside: avoid;
    }
    table.stripe td.name {
      width: 140px;
    }
    td.thead-athlete {
      width: 154px;
    }
    td.age {
      width: 30px;
    }
  }
</style>