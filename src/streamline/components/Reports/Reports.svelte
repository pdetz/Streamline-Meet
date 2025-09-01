<script>
  import { seasonStore, MY_TEAM } from '@src/stores';
  import Improvements from './Improvements.svelte';
    import SeasonResults from './SeasonResults.svelte';
    import HighPoint from './HighPoint.svelte';
    import SelectButtons from '@shared/components/SelectButtons.svelte';
    import { MCSL_MEETS } from '@models/MeetTypes/MeetType';

  import ScrollBox from '@shared/components/ScrollBox.svelte';
    import Season from '@models/Season';

  let reports = [
    { name: 'Improvements', component: Improvements },
    { name: 'Season Results', component: SeasonResults },
    { name: 'High Point', component: HighPoint }
  ];
  let selectedReport = null;

</script>

<div class="container">
  <div class="meet-sidebar-scrollbox">
  <ScrollBox width="13rem" cssClass="meet-sidebar-scrollbox">
    <div class="sidebar">
        <SelectButtons 
          options={reports} 
          selected={selectedReport} 
          select={(report) => selectedReport = report} 
          text={(report) => `${report.name}`}
          css='small'
        />
    </div>
  </ScrollBox>
  </div>
  
    <div class="main-content">
        {#if selectedReport}
            <svelte:component this={selectedReport.component} />
        {:else}
            <p>Select a report to view.</p>
        {/if}
    </div>

    
</div>

<style>
  @media (max-width: 768px) { /* Adjust this breakpoint as needed */
    .meet-sidebar-scrollbox {
      display: none; /* Hide the sidebar */
    }

    /* You might also want to adjust the main-content padding or width here */
    .main-content {
      padding-left: 0; /* Remove padding if sidebar is hidden */
      width: 100%; /* Take full width */
    }
  }

    .sidebar {
        height: 100%;
        background-color: var(--bg-color-1);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

  .container {
    display: flex;
    height: 100%;
  }
  
  div.meet {
    display: flex;
    flex-direction: row;
    height: calc(100% - 6rem);
    border: 1px solid var(--border-color);
  }

  .main-content {
    flex: 1;
    padding-left: 1rem;
    background-color: var(--bg-color-1);
    color: var(--text-color-1);
    overflow-y: hidden;
  }
</style>