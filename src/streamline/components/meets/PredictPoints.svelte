<script>
    export let swimmer;
    export let event;
    export let type;

        let points;
      $: currentEntry = swimmer.findSwimByEvent(event, type);
      $: if (currentEntry) {
        points = currentEntry.points;
        if (points === 0) points = '';
      } else {
        points = '';
      }
</script>

<div>
{points}
</div>