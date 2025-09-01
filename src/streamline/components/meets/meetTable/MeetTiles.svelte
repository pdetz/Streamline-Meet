<script>
    export let meets;
    export let size = { width: "30rem", height: "auto" };
    export let setView = () => {};

    import Tile from "@shared/components/Tile.svelte";;
    import UploadFilesButton from "../../UploadFilesButton.svelte";
    import MeetTile from "./MeetTile.svelte";
    import { MY_TEAM, MY_DIVISION } from "@src/stores";
    import { integrateFile } from "@files/integrateFile.js";

      
    let counter = 0;
    function onFilesSelected(files){
        files.forEach(file => {
          integrateFile(file, $MY_TEAM, $MY_DIVISION);
        });
        counter++;
    }
    
</script>

<div class="flex">
    <Tile {size} >
      <div slot="title">Manage Meets</div>
      <UploadFilesButton {onFilesSelected} />
    </Tile>
    {#key counter}
      {#each meets as meet}
        <MeetTile {meet} {size} {setView} />
      {/each}
    {/key}
</div>

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1rem;
  }
</style>