<script>
    export let meet;
    export let group=null;
    export let showDistance = false;
    export let selectedEmojis;
    export let cssClass='';
    export let type = 'planning';
    export let showAllSwimmers = true;
    
    import LineUpsRow from './LineUpsRow.svelte';
    import { MY_TEAM } from '@src/stores';

    $: myTeam = $MY_TEAM;
    $: allSwimmers = group.swimmers.filter(swimmer => swimmer.team.abbr === myTeam.abbr);
    let swimmers = allSwimmers;
    $: if (showAllSwimmers) {
      swimmers = allSwimmers.sort((a, b) => a.nameSort(b));
    } else {
      swimmers = allSwimmers.filter(swimmer => swimmer.swimsByMeet(meet, type).length > 0)
        .sort((a, b) => a.nameSort(b));
    }

    $: events = group.eventIndices.map(n => meet.events[n]);

    //console.log('LineUP Table', selectedEmojis);
</script>

<table class={"list stripe " + cssClass}>

  <thead>
    <tr>
      <td class="name">
        {group.name}
        <span class="count">({swimmers.length})</span>
      </td>
      {#each events as event}
        <td>{#if showDistance}{event.distance}{/if} {event.stroke.abbr}</td>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr class="events">
      <td class="right">Event #s — Please learn</td>
      {#each events as event}
        <td class='stroke'>{event.n}</td>
      {/each}
    </tr>
    {#each swimmers as swimmer}
      <LineUpsRow {swimmer} {events} {type} {group} {selectedEmojis} />
    {/each}
  </tbody>
</table>

<style>  
  table.stripe tr.events {
      font-style:italic;
      font-weight: normal;
  }
  
  table.stripe td.right{
      text-align: right;
      padding-right: 0.25rem;
  }
  

  table.lineups td.stroke {
    min-width: 1.9rem;
  }

  table.entries td.stroke {
    width: 6rem;
  }

  @media print {
    table.entries td.stroke {
      width: 100px;
    }
      
    table.lineups td.stroke {
      width: 30px;
    }
  }
</style>