<script>
  import { onMount } from 'svelte';
  import initializeParse from '@src/shared/data/initializeParse';
  import { loadParseObjectById } from '@src/shared/data/LoadParseObjects';
  import NavbarLayout from '@src/shared/components/NavbarLayout.svelte';
  import MeetFiles from '@src/components/MeetFiles.svelte';
  import MeetSettings from '@src/components/MeetSettings.svelte';
  import RunMeet from '@src/components/RunMeet.svelte';
  import Meet from '@shared/models/Meet';
  import EditEvents from '@src/components/EditEvents/EditEvents.svelte';
  import { MEET, viewStore } from '@src/stores';
  import { appState } from '@src/state/state.svelte.js';

  let loading = true;

  let options;

  onMount(async () => {
    try {
      const meetId = new URLSearchParams(window.location.search).get('meet');
      let newMeet;
      
      if (meetId) {
        initializeParse(); // Ensure Parse is initialized
        newMeet = await loadParseObjectById('New Meet', meetId);
      } else {
        newMeet = new Meet({name: 'Test Meet', meetType: ''});
      }

      MEET.set(newMeet);
      
      appState.meet = newMeet;

      options = [
        { name: 'Meet Files', component: MeetFiles },
        { name: 'Meet Settings', component: MeetSettings },
        { name: 'Run Meet', component: RunMeet },
        { name: 'Edit Events', component: EditEvents }
      ];
      document.title = newMeet.name || "Better Meet App";
    } catch (error) {
      console.error("Error during initialization or loading meet:", error);
    } finally {

      loading = false; // Data is fully loaded
      viewStore.set(options[0]); // Set the default view
    }
  });
</script>

<NavbarLayout {options} {loading} />
<input id="fileInput" type="file" style="display: none;" />