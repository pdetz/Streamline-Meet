<script>
  import ScrollBox from '@shared/components/ScrollBox.svelte';
  import SelectButtons from '@src/shared/components/SelectButtons.svelte';
  import { STATE } from '@src/state/state.svelte.js';

  let meet = $derived(STATE.meet);
  let selectedEvent = $state(meet.events[0]);

</script>

<div class="container">
  <div class="meet-sidebar-scrollbox">
  <ScrollBox width="13rem" cssClass="meet-sidebar-scrollbox">
    <SelectButtons 
        options={meet.events}
        text = {(event) => event.name}
        selected = {selectedEvent}
        select = {(event) => selectedEvent = event}
    />

  </ScrollBox>
  </div>
  
  <div class="main-content">
        Heat, lane, and swimmer UI here
        {selectedEvent.name}
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