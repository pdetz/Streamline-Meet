<script>
    import { numberToTime } from  "@models/Swim";
    import { median, stDev } from "../stats";
    import { newParseObject } from "@data/ParseHelpers";

    export let times = [];
    export let updateView;
    export let numberOfTimes;

    $: filteredTimes = times.filter(t => t !== null);
    $: medianTime = median(times);

    function buttonMessage() {
        if (filteredTimes.length > 1) {
            return 'Submit ' + numberToTime(medianTime);
        }
        return 'Submit NO SWIM';
    }

    async function sendTime() {
        let newResult = await newParseObject('MeetResult', {
            meetId: meet.objectId,
            times: times,
            result: medianTime,
            sd100: sd100
        });
        console.log('Sent times to backend: ' + JSON.stringify(newResult));
        times = Array(numberOfTimes).fill(null);
        currentIndex = 0;
        currentTime = null;        
        timeScroll = false;
        updateView();
    }
</script>

<div>
    {#if (filteredTimes.length >= numberOfTimes)}
        Submit the following times?
    {:else if (filteredTimes.length === 0)}
        There are no times entered.<br>
        Submit a No Swim?
    {:else}
        There are only {filteredTimes.length} times entered.<br>
        Submit these times?
    {/if}

    <div class='times'>
        {#each filteredTimes as time, index}
            <div class={time === medianTime ? 'median time' : 'time'}>
                {#if time !== null}
                    {numberToTime(time)}
                {:else}
                    NT    
                {/if}
            </div>
        {/each}
    </div>

    <button class='sb tool submit' on:click={sendTime}>
        {buttonMessage()}
    </button>
</div>

<style>
    .times {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 2vh;
        margin: 1rem 0;
    }
    .time {
        border: 1px solid #aaa;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        margin: 0 0.5rem;
        width: 75%;
        text-align: center;
        font-size: 6vh;
    }
    .median.time {
        border: 4px solid black;
        outline: 2px solid #6af;
    }
</style>