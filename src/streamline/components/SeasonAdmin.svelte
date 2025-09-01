<script>
    import { checkIfObjectExists, updateParseObject, upsertParseObjectByProps } from '@data/ParseHelpers';
    import { pullMcslDivisionData } from '@data/pullMcslDivisionData.js';
    import { pullMcslSeasonMeets } from '@data/pullMcslSeasonMeets';
    import { leagueStore, seasonStore } from '@src/stores';
    import Tile from '@shared/components/Tile.svelte';
    import { loadParseObjects } from '@data/LoadParseObjects';
    import { pullMcslMeetResults } from '@data/pullMcslMeetResults';
    import File from '@data/files/File';
    import Parse from 'parse/dist/parse.min.js';
    import { onMount } from 'svelte';
    import ScrollBox from '@shared/components/ScrollBox.svelte';

    let divisionInput = 'A';
    let content = '';
    $: league = $leagueStore;
    $: season = $seasonStore;
    $: weeks = season ? season.weeks : [];
   // $: season = $seasonStore;
   let users = [];

    // Load users when the component mounts

   onMount(async () => {
        // Ensure the season is loaded
        users = await loadParseObjects('_User');
    });

async function createRelayCarnivals() {
    for (let division of season.divisions) {
        const teamIds = division.teams.map(team => team.objectId);
        const nullFiles = division.teams.map(team => null);

        let relayCarnival = {
            abbr: `${division.name} RELAYS`,
            startDate: '07062025',
            endDate: '07062025',
            divisionName: division.name,
            is_official: true,
            meetType: 'REL',
            name: `Division ${division.name} Relay Carnival`,
            seasonId: season.objectId,
            teamIds,
            entriesFiles: nullFiles,
            resultsFiles: nullFiles
        };
        console.log('Division:', division);
        console.log('Relay Carnival:', relayCarnival);
        await upsertParseObjectByProps('Meet', {abbr: relayCarnival.abbr, seasonId: season.objectId}, relayCarnival);
    }
}

async function createDivisionals() {
    for (let division of season.divisions) {
        const teamIds = division.teams.map(team => team.objectId);
        const nullFiles = division.teams.map(team => null);

        let divisional = {
            abbr: `${division.name} DIV`,
            startDate: '07192025',
            endDate: '07192025',
            divisionName: division.name,
            is_official: true,
            meetType: 'DIV',
            name: `${division.name} Divisionals`,
            seasonId: season.objectId,
            teamIds,
            entriesFiles: nullFiles,
            resultsFiles: nullFiles
        };
        console.log('Division:', division);
        console.log('Divisional:', divisional);
        await upsertParseObjectByProps('Meet', {abbr: divisional.abbr, seasonId: season.objectId}, divisional);
    }
}

async function pullDivisionAssignments() {
    let divisionAssignment = {};
    for (const d of league.divisionNames) {

        const data = await pullMcslDivisionData(d);
        console.log(`Fetched data for ${d}:`, data);
        divisionAssignment[d] = data;
    }
    console.log(divisionAssignment);
    upsertParseObjectByProps('Season', {year: "2025"}, {divisionAssignments: divisionAssignment});
}

async function pullSeasonMeets() {
    const season = await checkIfObjectExists('Season', { year: '2025'});
    for (const d of league.divisionNames) {
    //    const data = await pullMcslDivisionData(d);
        await pullMcslSeasonMeets(d, season);
    }
}

async function pullMeetResults(week) {
    const meets = season.getMeetsByDate(week);
    for (const meet of meets) {
        //console.log('Checking meet:', meet.name, 'Division:', meet.divisionName, 'Results files:', meet.resultsFiles.length);
        //if (meet.divisionName !== 'J') continue;
        //if (meet.resultsFiles[0] === null) continue;
        //console.log(meet.name);

        //if (!meet.teams.some(team => team.abbr === 'KFM')) continue;
        
        if (meet.resultsFiles[0].fileFormat === 'html' || meet.resultsFiles[0].name === 'NULL_FILE.hy3') {
            const resultsFile = await pullMcslMeetResults(meet);
            //console.log('pull meet results', resultsFile.contents);
            await meet.updateResults(resultsFile);
        }
    }
    //console.log(week, meets);
}

async function setUsersToCurrentSeason() {
    const users = await loadParseObjects('_User');

    const seasonPointer = Parse.Object.extend('Season').createWithoutData(season.objectId);

    for (const user of users) {
        // Check if user.seasonId exists and if it's different from the current season's objectId
        // Note: For existing pointers, user.seasonId might not be directly available,
        // you might need user.get('season')?.id if 'season' is already a pointer
        const userSeasonId = user.season ? user.season.objectId : null;

        if (!userSeasonId || userSeasonId !== season.objectId) {
            // Pass the Parse Pointer object to the 'season' field
            await updateParseObject(user, '_User', { season: seasonPointer });
        }
    }
    console.log('All users updated to current season:', season.year);
}
</script>

<Tile>
    <div slot='title'>
        2025 Season Admin
    </div>
    <div>
        <button class='sb tool' disabled=true
            on:click={()=>pullDivisionAssignments()}>
            Pull Division Assignments
        </button>
        <button class='sb tool'
            on:click={pullSeasonMeets}>
            Pull Season Meets
        </button>
        <button class='sb tool'
            on:click={pullSeasonMeets}>
            Pull Season Meets
        </button>
        
        <button class='sb tool'
            on:click={createRelayCarnivals}>
            Create Relay Carnivals
        </button>
        <button class='sb tool'
            on:click={createDivisionals}>
            Create Divisionals
        </button>
        <button class='sb tool'
            on:click={setUsersToCurrentSeason}>
            Set Users to Current Season
        </button>
    </div>
    <div class='h-flex'>
        <div class='v-flex'>
            {#each weeks as week}
                <button class='sb tool' on:click={()=>pullMeetResults(week)}>
                    {week}
                </button>
            {/each}
        </div>
        <div>
            <ScrollBox height='16rem'>
                <table class="list">
                    <thead>
                        <tr>
                            <td> User </td>
                            <td> Password </td>
                        </tr>
                    </thead>
                    <tbody>
                        {#each users as user}
                            <tr>
                                <td>{user.username}</td>
                                <td>{user.team.abbr}mcsl{user.n}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollBox>
        </div>
    </div>
</Tile>

<style>
    button.sb.tool:disabled {
        background-color: #aaa;
        color: #444;
    }

    div.h-flex {
        display: flex;
        gap: 1em
    }
    div.v-flex {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
</style>