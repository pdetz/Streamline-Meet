<script>
    export let meet;

    import Page from '@shared/components/Page.svelte';
    import ScrollBox from '@shared/components/ScrollBox.svelte';
    import SelectButtons from '@shared/components/SelectButtons.svelte';
    import LineUps from './LineUps.svelte';



    // Create an array of AgeGroup objects, one male and one female for each bag
/*    function documentAgeGroups(bags, team){
        let ageGroups = bags.flatMap(ages => [
        new AgeGroup({ 
            ages,
            gender: 'M', 
            genders: { 'M': 'Boys', 'F': 'Girls', 'X': 'Mixed' }
        }),
        new AgeGroup({ 
            ages, 
            gender: 'F',
            genders: { 'M': 'Boys', 'F': 'Girls', 'X': 'Mixed' }
        })
    ]);
    ageGroups.forEach(ag => {
        ag.swimmers = team.swimmers.filter(swimmer => ag.swimmerBelongs(swimmer));
    });
    return ageGroups;
    }
*/
    const documents = ['Line Ups', 'Results', 'Program', 'Heat Sheet'];
    let selectedDocument = null;
    let ViewDocument;
    
    function selectDocument(document) {
        selectedDocument = document;
        switch (document) {
            case 'Line Ups':
                ViewDocument = LineUps;
                break;
            case 'Results':
                ViewDocument = ResultsTable;
                break;
            case 'Program':
                ViewDocument = MeetProgram;
                break;
            case 'Heat Sheet':
                ViewDocument = MeetHeatSheet;
                break;
            default:
                ViewDocument = null;
        }
    }

</script>

<ScrollBox width='13in'>
    {#if ViewDocument}
            <svelte:component this={ViewDocument} meet={meet} />
    {/if}
</ScrollBox>

<ScrollBox width='12rem'>
    <div class='button-column'>
        <SelectButtons
            options={documents}
            selected={selectedDocument}
            select={selectDocument}
            text={(d) => d}
        />
    </div>
</ScrollBox>


<style>
    /* Your existing styles */
    .button-column {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.75rem;
      padding: 0.5rem;
      text-align: center;
      width: 7.5rem;
    }
</style>