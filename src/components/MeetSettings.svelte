<script>
    export let meet;
    import { MEET_PROPS } from '@models/Meet';
    import TextBox from '@shared/components/TextBox.svelte';
    import { MEET } from '@src/stores';

    const props = ['name', 'abbr', 'date', 'facility', 'divisionName'];
</script>

<div>
    Meet Settings
    <table>
        {#each props as prop}
            <tr>
                <td> {MEET_PROPS[prop]} </td>
                <td> <TextBox object={$MEET} {prop} /></td>
            </tr>
        {/each}
    </table>
</div>