<script>
    import { MEET_PROPS } from '@models/Meet';
    import TextBox from '@shared/components/TextBox.svelte';
    import { appState } from '@src/state/state.svelte.js';
    
    
    let meet = $derived(appState.meet);

    const props = ['name', 'abbr', 'date', 'facility', 'divisionName'];
</script>

<div>
    Meet Settings
    <table>
        {#each props as prop}
            <tr>
                <td> {MEET_PROPS[prop]} </td>
                <td> <TextBox object={meet} {prop} /></td>
            </tr>
        {/each}
    </table>
</div>