<script>
    import Tile from "@shared/components/Tile.svelte";
    import Team from "@models/Team";
    import Discrepancy from "@models/Discrepancy";
    import UploadFilesButton from "@shared/components/UploadFilesButton.svelte";
    import { getTeamsFromFile, meetInfoFromFile } from "@files/integrateFile";
    import { getEventsFromFile } from "@files/getEventsFromFile";
    import Discrepancies from "./Discrepancies.svelte";
    import File from "@src/shared/data/files/File";
    import { appState } from '@src/state/state.svelte.js';

    const size = { width: "20rem", height: "auto" };

    let counter = 0;
    let discrepancy = false;
    let meetInfos;

    let meet = $derived(appState.meet);

    function onFilesSelected(files){
        files.forEach(f => {
            const file = new File(f);
            console.log(file);
            let fileTeams = getTeamsFromFile(file);
            getEventsFromFile(file);
            fileTeams.forEach(team => {
              if (!meet.getTeamByAbbreviation(team.abbr)) {
                meet.teams.push(new Team(team));
              }
            })
        });

        console.log(meet);
        meetInfos = files.map(file => meetInfoFromFile(file));
        
        discrepancy = new Discrepancy([meet, ...meetInfos]);
    }
</script>

<div class="flex">
    <Tile {size}>
      <div slot="title">Manage Meets</div>
      <UploadFilesButton {onFilesSelected} />
    </Tile>
    {#if discrepancy}
        <Discrepancies {meet} {discrepancy} />
    {/if}
</div>

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1rem;
  }
</style>