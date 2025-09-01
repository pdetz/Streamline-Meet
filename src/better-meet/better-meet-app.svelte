<script>
  import { onMount } from 'svelte';
  import initializeParse from '@shared/data/initializeParse';
  import { userStore, viewStore, MEET } from '@src/stores';
  import { loadParseObjectsById } from '@shared/data/LoadParseObjects';


  import NavbarLayout from '@shared/components/NavbarLayout.svelte';
  import MeetFiles from './components/MeetFiles.svelte';
  import MeetSettings from './components/MeetSettings.svelte';
  import RunMeet from './components/RunMeet.svelte';
  import Meet from '@models/Meet';

  let loading = true;

  let options = [
        { name: 'Meet Files', component: MeetFiles, props: {  } },
        { name: 'Meet Settings', component: MeetSettings, props: {  } },
        { name: 'Run Meet', component: RunMeet, props: {  } },
      ];
  $: meet = $MEET;

  onMount(async () => {
    try {
      const meetId = new URLSearchParams(window.location.search).get('meet');
      let newMeet;
      
      if (meetId) {
        initializeParse(); // Ensure Parse is initialized
        newMeet = await loadParseObjectById('Meet', meetId);
      } else {
        newMeet = new Meet({});
      }
      MEET.set(newMeet);
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