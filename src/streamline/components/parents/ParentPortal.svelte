<script>
    import { MY_DIVISION, MY_TEAM } from '@src/stores';
    import { MCSL_MEETS } from '@models/MeetTypes/MeetType';
    import ParentView from './ParentView.svelte';
    
 
    // Store values
    let MyDivision;
    let MyTeam;
    let selectedSwimmer;

    // Subscribe to the store values
    $: MyDivision = $MY_DIVISION;
    $: MyTeam = $MY_TEAM;


    let ageGroups;

    // Ensure that MyTeam is defined before using it
    $: if (MyTeam) {
        ageGroups =
            MCSL_MEETS.A.ageGroups.map(ag => {
            return {
                swimmers: MyTeam.filterSwimmers(ag),
                name: ag.name
            }
        });
    } else {
        console.log("MyTeam is undefined");
    }

    function selectSwimmer(swimmer) {
        selectedSwimmer = swimmer;
    }

</script>

<div class="flex">

        <div class="scroll list">
            {#each ageGroups as ag}
                <div>
                    {ag.name}<br>
                    {#each ag.swimmers as swimmer}
                    <button 
                        class="inv"
                        class:sel={swimmer===selectedSwimmer}
                        on:click={() => selectSwimmer(swimmer)}
                    >
                            {swimmer.display}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
        <div class="scroll pv">
            <ParentView swimmer={selectedSwimmer}/>
        </div>
</div>

<style>
    .flex {
        display: flex;
        gap: 1rem;
        height: 100vh;
    }

    .scroll {

        height: 100%;
        overflow-y: scroll;
    }
    .list {
        width: 12rem;
    }
    .pv {
        width: 40rem;
    }

    .sel {
        background-color: #ccc;
        color: black;
    }
</style>
