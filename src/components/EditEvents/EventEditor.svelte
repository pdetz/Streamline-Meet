<script>
    let { event } = $props();

</script>

<div class='event'>
    {event.name}
</div>

<style>
    div.event {
        border: 1px solid var(--border-color);
        border-radius: 0.3rem;
        padding: 1rem;
    }
</style>