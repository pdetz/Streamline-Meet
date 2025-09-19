<script>
    let { event } = $props();
    import { STATE } from '@src/state/state.svelte.js';
    import Tile from '@src/shared/components/Tile.svelte';
    import { STROKES } from '@src/shared/models/LeagueData';
    import DropDownMenu from '@src/shared/components/DropDownMenu.svelte';
    import { updateEventInMeet } from '@src/state/state.svelte.js';

    function updateStroke(stroke) {
        console.log('updating stroke', stroke);
        currentEvent = updateEventInMeet(event, {stroke: stroke});
    }
    function updateGender(gender) {
        console.log('updating gender', gender);
        currentEvent = updateEventInMeet(event, {gender: gender});
        console.log(currentEvent);
    }

    let currentEvent = $derived(event);

</script>

<Tile size={{ width: "100%", height: "auto" }}>
    <div class='title' slot='title'>
        {currentEvent.name}
    </div>
    <div class='controls'>
        <DropDownMenu>
            <div slot=menu-button>
                Choose Stroke v
            </div>
            <div class='strokes'>
                {#each STATE.meet.type.strokes as stroke}
                    <button onclick={() => updateStroke(stroke)}
                        class={'sb stroke ' + stroke.abbr + (currentEvent.stroke.abbr === stroke.abbr ? ' selected' : '')}>
                        {stroke.name}
                    </button>
                {/each}
            </div>
        </DropDownMenu>
        <div class='genders'>
            {#each Object.keys(STATE.meet.type.genders) as genderKey}
                <button onclick={() => updateGender(genderKey)}
                    class={'sb gender ' + (genderKey === currentEvent.gender ? ' selected' : '')}>
                    {STATE.meet.type.genders[genderKey]}
                </button>
            {/each}
        </div>
    </div>
</Tile>

<style>
    div.title {
        text-align: left;
    }
    div.controls {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    div.strokes {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        gap: 0rem;
        flex-wrap: wrap;
    }
</style>