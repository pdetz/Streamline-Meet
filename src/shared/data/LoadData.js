// data/LoadData.js
import { loadParseObjects, loadParseObjectById } from '@data/LoadParseObjects';
import { userStore, seasonStore, leagueStore, MY_DIVISION, MY_TEAM, clearStores, viewStore, meetsToConfirmStore } from '@src/stores';
import { get } from 'svelte/store';
import { updateParseObject } from './ParseHelpers';
import Parse from 'parse/dist/parse.min.js';
import createRelayCarnivals from '@models/MeetTypes/createRelayCarnival';
import pullDivisionalHtml from './pullDivisionalHtml';
import { checkCurrentUser } from './ACL';
import { logOut } from './loginout';
import File from './files/File';

async function loadData(user) {
  if (!user) return;

  try {
    // Load Season & League
    if (!user.season || !user.league || !user.team) {
      const now = new Date();
      console.error(`Error (UTC: ${now.toUTCString()}): User does not have a season, league, or team assigned.`);
      console.error('User data:', user);
      return;
    }
    clearStores();
 
    userStore.set(user);
    seasonStore.set(user.season);
    leagueStore.set(user.league);
    
    if (user.role === 'admin') {
      if (user.leagueTeams.length === 0) {
        const leagueTeams = await loadParseObjects('Team', { leagueId: user.league.objectId});
        user.leagueTeams = leagueTeams.filter(team => team.objectId !== user.team.objectId);
        user.leagueTeams.push(user.team);
        user.leagueTeams.sort((a, b) => a.name.localeCompare(b.name));
        user.season.sortLoadedTeamsIntoDivisions(user.leagueTeams);
        for (const division of user.season.divisions) {
          await loadDivision(division, user.season, user.team);
        }
        user.division = user.season.divisionOfTeam(user.team);
        user.team.thisIsMyTeam = true;
      }
      let teamPointer = Parse.Object.extend('Team').createWithoutData(user.team.objectId);
      const newCoach = await loadParseObjects('_User', { role: 'coach', team: teamPointer });
      user.selectedCoach = newCoach[0]; // Assuming you want the first coach in the list
      userStore.set(user);
    } else {
      user.division = await loadDivision(user.season.divisionOfTeam(user.team), user.season, user.team);
    }

    await loadTeam(user.team, user.season);

    MY_DIVISION.set(user.division);
    MY_TEAM.set(user.team);

    user.setUserColors();
    console.log(user.team);

    meetsToConfirmStore.set(user.team.meets.slice(12, 14));
    console.log('Meets to confirm:', get(meetsToConfirmStore));
    console.log(user.league);

    //await season.createDivisionalsMeets();
    //await createRelayCarnivals(league, season);
    //await updateMeets(season);
    await checkCurrentUser();
  } catch (error) {
    console.error('Error during loading data:', error);
    logOut(); // Log out the user if there's an error
    throw error;
  }
}

async function loadDivision(division, season, team = null) {
  if (!division) throw new Error(`Division not found.`);

  if (division.meetsLoaded) return division;

  // Load all teams in the division
  if (!division.teamsLoaded) {
    division.teams = await Promise.all(
      division.teams.map(async (teamData) => {
        if (team && team.objectId === teamData.objectId) return team;

        return await loadParseObjectById('Team', teamData.objectId);;
      }).filter(t => t !== null)
    );
    division.teamsLoaded = true;
  }
  // Load all meets in the division
  const meets = await loadParseObjects('Meet', {
    seasonId: season.objectId,
    divisionName: division.name
  });

  division.addMeets(meets);

  division.meets.forEach(meet => meet.parseFiles());
  division.meetsLoaded = true;
  season.updateDivision(division);
  return division;
}

async function loadTeam(team, season) {
  // Load the team directly if it's already in the division
  const user = get(userStore);

  // Load only the meets that include this team (without loading the full division)
  const teamMeets = await loadParseObjects('Meet', {
    seasonId: season.objectId,
    divisionName: '', // No division filtering, just find meets including this team
  }, { teamIds: [team.objectId] });

  // Attach meets to the team
  team.addMeets(teamMeets);

  if (user.team.objectId === team.objectId) {
    const rosterFile = await loadParseObjects('RosterFile', {
      teamId: team.objectId,
      seasonId: season.objectId
    });
    user.updateTeam(team);
    team.rosterFile = new File(rosterFile[0]) || null;
    if (rosterFile) team.parseRosterFile();

    await integrateMeetPlans(team);
    
    team.meetConfirmations = await loadParseObjects('MeetConfirmation',
      { teamId: team.objectId });
    team.meetConfirmations.forEach(mc => mc.integrate(team));
  }

  team.meets.forEach(meet => {
    meet.connectAMeet();
    meet.parseFiles()
  });

  return team;
}

async function integrateMeetPlans(myTeam) {
  myTeam.meetPlans = await loadParseObjects('MeetPlan', {teamId: myTeam.objectId});
  myTeam.meetPlans.forEach(mp => {
    const meet = myTeam.findMeetById(mp.meetId);
    if (meet) {
      meet.meetPlan = mp;
      meet.parseSwims(mp.planningFile, 'planning', 'seed');
    }
  });
}

// Used to set up the season's division assignment, not currently in use
async function createDivisionsMap(season, divisionNames) {
  const divisionsMap = {};
  
  for (const division of divisionNames) {
    const divisionTeams = await loadParseObjects('Team', {divisionName: division});
    divisionsMap[division] = divisionTeams.map(team => {
      return {
        objectId: team.objectId,
        name: team.name,
        abbr: team.abbr
      };
    });
  }
  console.log(season);
  updateParseObject(season, 'Season', {divisionAssignments: divisionsMap});
  
  return divisionsMap;
}

export { loadData, loadDivision, loadTeam };
