<script>
  export let meet;

  $: resultsFile = meet.resultsFile ?? null;

  async function handleClick() {
    resultsFile = await pullMcslMeetResults(meet); 
    if (resultsFile) {
      // Update entries manually after file dialog is complete
      await meet.updateResults(resultsFile);
      console.log("Results updated: ", meet.resultsFiles);
    } else {
      console.error('File upload was canceled or no file was selected.');
    }
  }
</script>

{#if !resultsFile}
<button class="sb" on:click={handleClick}>
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="currentColor"
       width="1rem"
       height="1rem"
       class="grey">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 10H13z"/>
  </svg>
    <div class='text'>Pull {meet.name} Results from MCSL</div>
</button>
{/if}

<style>
  .sb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .text {
    text-align: left;
  }
  .grey {
    color: var(--bg-color-2);
  }
</style>
