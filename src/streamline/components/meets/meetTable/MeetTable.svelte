<script>
    export let meets;
    export let teamOrDivision;

    import UploadFilesButton from "../../UploadFilesButton.svelte";
    import { MY_TEAM, MY_DIVISION, seasonStore, updateMeetViewStore } from "@src/stores";
    import { integrateFile } from "@files/integrateFile.js";
    import File from "@data/files/File";

    $: sortedMeets = meets.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    });

    let counter = 0;

    function onFilesSelected(files){
        files.forEach(file => {
          const newFile = new File({
            name: file.name,
            contents: file.contents
          });
          integrateFile(newFile, $MY_TEAM, $MY_DIVISION);
        });
        counter++;
    }

    function setView(meet, view) {
        updateMeetViewStore(meet, view);
    }

</script>

<div class='container'>
  <div class='title'>
    {#if teamOrDivision}
      {(teamOrDivision === $MY_TEAM ?
      '' : 'Division ') + teamOrDivision.name}
    {/if}
    Meets for the {$seasonStore.year} Season
  </div>
    <table class="list">
        <thead>
            <tr>
                <th>Meet</th>
                <th>Date</th>
                <th>View Planning or Results</th>
            </tr>
        </thead>
        <tbody>
          {#each sortedMeets as meet}
            <tr>
              <td>
                <button class='sb meet' on:click={()=>setView(meet)}>{meet.name}</button>
              </td>
              <td>{meet.startDate}</td>
              <td class='links'>
                {#if meet.getDefaultView() === 'planning'}
                  <button class='sb tool' on:click={()=>setView(meet, 'planning')}>Planning</button>
                {:else if meet.getDefaultView() === 'entries'}
                  <button class='sb tool' on:click={()=>setView(meet, 'entries')}>Entries</button>
                {:else}
                  <button class='sb tool' on:click={()=>setView(meet, 'results')}>Results</button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
    </table>
    
    
    <UploadFilesButton {onFilesSelected} />
</div>

<style>
  div.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 40em;
  }
  div.title {
    font-weight: bold;
    width: 100%;
    text-align: center;
  }
  table.list {
    font-size: 0.9em;
  }
  table td {
    text-align: center;
  }
  td.links {
    padding: 0.5rem;
  }
  button.sb.meet {
    width: 100%;
    text-align: left;
    background-color: transparent;
    padding: 0 0.5rem;
    cursor: pointer;
  }
  
  button.sb.tool {
    padding: 0.1rem 1rem;
    cursor: pointer;
  }
</style>