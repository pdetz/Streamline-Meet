<script>
    export let meet;

    function openMeetInNewTab(meet) {
        const url = `/better-meet?meet=${meet.objectId}`;
        window.open(url, '_blank');
    }
</script>

<button class="sb"
    on:click={() => openMeetInNewTab(meet)}>
    Open {meet.name} in BetterMeet
</button>