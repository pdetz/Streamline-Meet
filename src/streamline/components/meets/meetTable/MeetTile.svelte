<!-- MeetTile.svelte -->
<script>
    export let meet;
    export let size;
    export let setView=() => {};
  
    import Tile from "@shared/components/Tile.svelte";
    import MeetEntriesButton from "./MeetEntriesButton.svelte";
    import MeetResultsButton from "./MeetResultsButton.svelte";
    import MeetRostersButton from './MeetRostersButton.svelte';
    import TeamsPoints from "../TeamsPoints.svelte";
    import OpenBetterMeetButton from "../OpenBetterMeetButton.svelte";
    import { selectedMeetStore } from "@src/stores";

    function meetNav(meet) {
      meet.view = 'meetNav';
      selectedMeetStore.set(meet);
    }
  
  </script>
  
  <Tile {size}>
    <div slot="title">
      <button class='sb' on:click={()=>meetNav(meet)}>{meet.name}</button><br>
      <div class="small">{meet.startDate}</div>
      <TeamsPoints {meet} prop='name'/>
    </div>
    <div class="box">
      Meet Entries
      <div class="buttons">
        {#each meet.teams as team}
          <MeetEntriesButton {meet} {team} />
        {/each}
      </div>
    </div>
    <div class="box">
      Team Rosters
      <div class="buttons">
        {#each meet.teams as team}
          <MeetRostersButton {team} />
        {/each}
      </div>
    </div>
    <div class="box">
      Meet Results
      <div class="buttons">
        <MeetResultsButton {meet} />
      </div>
    </div>
    <OpenBetterMeetButton {meet} />
  </Tile>
  
  <style>
    .box {
      width: 100%;
      border-radius: 0.3rem;
      background-color: var(--bg-color-2);
      padding: 0.5rem;
      font-size: 0.75em;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }
    .small {
      font-size: 0.75em;
      font-weight: normal;
    }
  </style>
  