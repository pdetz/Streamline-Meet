<script>
    export let relay;
    export let updateLeg;

    import { findFastestSplits } from './relayUtils';
    import ScrollBox from '@shared/components/ScrollBox.svelte';

    import {selectedMeetStore} from '@src/stores';
    $: selectedMeet = $selectedMeetStore;

    let splits;
    $: if (relay && relay.selectedSwim && relay.selectedIndex > -1) {
        console.log('selected swim ', relay.selectedIndex);
        splits = findFastestSplits(relay, relay.selectedIndex, [...selectedMeet.absences.values()]);   
    } else {
        //console.log('no selected swim', relay.selectedSwim);
        splits = [];
    }

    function selectSwim(swim) {
        if (swim.swimmer.key !== relay.selectedSwim.swimmer.key) updateLeg(swim, relay.selectedIndex);
        //else updateLeg(relay.selectedSwim, relay.selectedIndex); // Deselect if already selected
        console.log('selectSwim', swim);
    }
</script>

<div class="list">
    <ScrollBox>
        {#each splits as split, index}
            <button
                class={`sb stroke ${relay.event.legs[relay.selectedIndex].stroke.abbr}`}
                class:selected={split.swimmer.key === relay.selectedSwim.swimmer.key}
                class:time={split.swimmer.key !== relay.selectedSwim.swimmer.key}
                on:click={() => selectSwim(split)}
            >
                <div class="swimmer">{split.swimmer.display}</div>
                <div class="seed text-right">{split.display('seed')}</div>
            </button>
        {/each}
    </ScrollBox>
</div>

<style>
    div.list {
        height: 100%;
    }
    button.sb {
        padding: 0.1em 0.2em;
        width: calc(100% - 0.5em);
        background-color: transparent;
        height: calc(1.4em + 4px);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    button.sb.stroke.FR {color: var(--FR);}
    button.sb.stroke.BK {color: var(--BK);}
    button.sb.stroke.BR {color: var(--BR);}
    button.sb.stroke.FL {color: var(--FL);}
    button.sb.stroke.selected {color: #000}

    button.sb div {
        display: inline-block;
        height: 1.2em;
    }
    div.swimmer {
        width: 12em;
        text-align: left;
        overflow: hidden;
    }
    div.seed {
        width: 4.5em;
        text-align: right;
        overflow: hidden;
    }
</style>