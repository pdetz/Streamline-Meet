<script>
    export let swimmer;
    export let event;
    export let updatePlanning;
    export let isOfficial = false;

    import { Swim } from '@models/Swim';
    import Tooltip from '@shared/components/Tooltip.svelte';

    $: dq = swimmer.best(event, isOfficial).dq?.description;
    $: currentSwim = event.findSwimBySwimmer(swimmer, 'planning');
    let text;
    $: if (currentSwim) {
        text = currentSwim.display('seed');
        if (currentSwim.seed > 9997) text = "NT";
    } else {
        text = swimmer.displayBest(event, isOfficial) || "";
    }

    function togglePlanning() {
        console.log(currentSwim);
        if (currentSwim) {
            currentSwim.removeSwim();
            currentSwim = false;
            text = swimmer.displayBest(event, isOfficial);
        } else {
            currentSwim = swimmer.newEventEntry(event, isOfficial);
        }
        event.calculateScore(event.meet.points, 'planning');
        updatePlanning();
    }
</script>

<Tooltip text={dq} >
<button class="planning {currentSwim ? ' selected' : ''}"
    on:click={() => togglePlanning()}>
    {text}
</button>
</Tooltip>

<style>
    button.planning {
      min-height: 1rem;
      text-align: right;
      padding-right: 0.5rem;
      width: 100%;
      border: 2px solid transparent;
      background-color: transparent;
    transition-duration: 0.5s;
    }

    button.planning:hover {
        border-color: var(--border-color-hl);
    }

    button.planning.selected {
        color: var(--sel-text-color);
        background-color: var(--sel-color-2);
    }

    :global(tr.my_team) button.planning.selected {
        background-color: var(--team-color);
    }

    tr.my_team td button.planning:hover {
        background-color: var(--team-color);
        color: var(--sel-text-color);
    }

    button.planning:active {
        transition-duration: 0s;
        border-color: transparent;
        background-color: transparent;
    }
  </style>