<script>
    let { event } = $props();
    import { STATE } from '@src/state/state.svelte.js';
    import Tile from '@src/shared/components/Tile.svelte';
    import { ageGroupName } from '@src/shared/models/AgeGroup';
    import NumberPicker from '@src/shared/components/NumberPicker.svelte';

    let strokes = $derived(STATE.meet.type.strokes.slice(1));

    let currentEvent = $state(event);

    function updateEvent(field, value) {
        event[field] = value;
        currentEvent = event;
    }

    function updateMinAge(n) {
        if (n < currentEvent.ages[1]) return updateEvent('ages', [n, currentEvent.ages[1]]);
        return updateEvent('ages', [n, n]);
    }
    
    function updateMaxAge(n) {
        if (n < currentEvent.ages[0]) return updateEvent('ages', [n, n]);
        if (n < 19) return updateEvent('ages', [currentEvent.ages[0], n]);
        if (n < currentEvent.ages[1]) return updateEvent('ages', [currentEvent.ages[0], 18]);
        return updateEvent('ages', [currentEvent.ages[0], 109]);
    }

    function showAge(n) {
        if (n === 109) return 'Over';
        if (n === 0) return 'Under';
        return n;
    }

    function eventName(event) {
      return `Event ${event.n} - ${ageGroupName(event, STATE.meet.type.genders)} ${event.distance} ${event.stroke.name}`;
    }
</script>

<Tile size={{ width: "100%", height: "auto" }}>
    <div class='title' slot='title'>
        {eventName(currentEvent)}
    </div>
    <div class='controls'>
        <div class='distance'>
            <NumberPicker n={currentEvent.distance} text="Distance"
                min={25} step={25} max={1000}
                updateN={(value) => updateEvent('distance', value)} />
        </div>
        <div class='strokes'>
            {#each strokes as stroke}
                <button onclick={() => updateEvent('stroke', stroke)}
                    class={'sb stroke ' + stroke.abbr + (currentEvent.stroke.abbr === stroke.abbr ? ' selected' : '')}>
                    {stroke.abbr}
                </button>
            {/each}
        </div>
        <div class='genders'>
            {#each Object.keys(STATE.meet.type.genders) as genderKey}
                <button onclick={() => updateEvent('gender', genderKey)}
                    class={'sb gender ' + (genderKey === currentEvent.gender ? ' selected' : '')}>
                    {STATE.meet.type.genders[genderKey]}
                </button>
            {/each}
        </div>
        <div class='ages'>
            <NumberPicker n={currentEvent.ages[0]} text="Min Age"
                min={0} step={1} max={18}
                updateN={(n) => updateMinAge(n)}
                showN={(n) => showAge(n)} />
            <NumberPicker n={currentEvent.ages[1]} text="Max Age"
                min={1} step={1} max={109}
                updateN={(n) => updateMaxAge(n)}
                showN={(n) => showAge(n)} />
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
        flex-direction: row;
        font-size: 0.8rem;
        gap: 0.2rem;
        flex-wrap: wrap;
    }
    button.sb.stroke {
        width: 2.5rem;
        padding: 0.2rem 0.1rem;
        height: fit-content;
    }
</style>