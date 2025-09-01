<script>
    import PageAndTools from '@meets/documents/PageAndTools.svelte';
    import ColorPicker from '@meets/documents/tools/ColorPicker.svelte';
    import { MY_TEAM, leagueStore, userStore } from "@src/stores";

    let topN = 1;
    let bags = [];

    $: if ($MY_TEAM.meets[0]) {
        bags = documentAgeGroups($leagueStore.bags, $MY_TEAM.meets[0]);
    }

    $: ageGroups = bags.map(ag => {
        const agSwimmers = $MY_TEAM.swimmers.filter(swimmer => {
            return ag.swimmerBelongs(swimmer);
        });
        return {
            name: ag.name,
            swimmers: agSwimmers.map(swimmer => {
            return {
                swimmer,
                points: swimmer.results
                    .filter(result => !result.event.relay)
                    .reduce((total, swim) => total + swim.points, 0)
            };
            }).sort((a, b) => b.points - a.points)
            .slice(0, topN)
        };
    }).sort((a, b) => a.swimmers[0].points - b.swimmers[0].points) || [];

    $: selectedColors = $userStore?.documentColors || ['#fff', '#fff'];

    function documentAgeGroups(bags, currentMeet) {
        if (!currentMeet) return [];
        let dags = currentMeet.ageGroups.filter(ag => {
            return ag.eventIndices.length > 0 && bags.some(bag => ag.isSameAgeAs({ ages: bag }));
        });
        return dags;
    }

  function selectColors(colors) {
    selectedColors = colors;
    $userStore.updateDocumentColors(colors);
  }
</script>

<PageAndTools title='High Point'>
  <svelte:fragment slot="document">
        <table class='stripe'>
            <thead>
                <tr>
                    <td>Age Group</td>
                    <td>Swimmer</td>
                    <td>Points</td>
                </tr>
            </thead>
            <tbody>
                {#each ageGroups as ageGroup}
                    {#each ageGroup.swimmers as swimmer}
                        <tr>
                            <td>{ageGroup.name}</td>
                            <td>{swimmer.swimmer.display}</td>
                            <td>{swimmer.points}</td>
                        </tr>
                        {#each swimmer.swimmer.results.filter(result => !result.event.relay && result.points > 0) as result}
                            <tr>
                                <td></td>
                                <td>{result.meet.abbr} - {result.event.name} - {result.result}</td>
                                <td>{result.points}</td>
                            </tr>
                        {/each}
                    {/each}
                {/each}
            </tbody>
        </table>
  </svelte:fragment>
  
  <svelte:fragment slot="tools">
    <ColorPicker
      {selectedColors}
      {selectColors}
    />
  </svelte:fragment>
</PageAndTools>

<style>
    div.content-box {
        height: calc(100vh - 4em);
    }
</style>