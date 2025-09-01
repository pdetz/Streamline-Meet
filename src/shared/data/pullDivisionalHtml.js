import { newParseObject, checkIfObjectExists } from "./ParseHelpers";
import { get } from 'svelte/store';
import { seasonStore } from "@src/stores";
import { loadParseObjects } from "./LoadParseObjects";
import { extractMeet } from "./pullMcslMeetResults";

async function pullDivisionalHtml(division) {
    console.log(division);
    
    const season = get(seasonStore);
    
    try {
        console.log(`Fetching data for division: ${division.name}`);
        //const divisionHtml = await fetchDivisionHtml(division.name);
        
        const teams = await loadParseObjects('Team', { 
            leagueId: season.leagueId,
            divisionName: division.name 
        });

        division.teams = teams;

        console.log('Teams:', teams);

        const meets = await loadParseObjects('Meet', {
            seasonId: season.objectId,
            divisionName: division.name
        });

        const meetSchedule = new Map(); // Stores assigned teams per week

        for (let week = 1; week <= 5; week++) {
            meetSchedule.set(week, new Set()); // Initialize each week with an empty Set
        }
        
        for (let t1 = 0; t1 < teams.length - 1; t1++) {
            for (let t2 = t1 + 1; t2 < teams.length; t2++) {
                let found = false;
                let week = 1;
        
                while (!found && week <= 5) {
                    // Skip if either team already has a meet this week
                    if (meetSchedule.get(week).has(teams[t1]) || meetSchedule.get(week).has(teams[t2])) {
                        week++;
                        continue;
                    }

                    for (let teamPair of [[teams[t1], teams[t2]], [teams[t2], teams[t1]]]) {
                        //console.log("fetching ", teams[t1].name, " vs ", teams[t2].name, " in week ", week);
                        try {
                            found = await fetchMeet(week, teamPair, meetSchedule);
                            if (found) {
                                division.addMeet(found);
                                break;
                            } // Exit loop if meet was found
                        } catch (error) {
                            console.error(`Error fetching meet for ${teamPair[0].name} vs ${teamPair[1].name} in week ${week}:`, error);
                        }
                    }
                    if (found) break; // Skip to next iteration if meet was found
                    week++;
                }
            }
        }
        
        
        //extractTeamsFromMeetResults(divisionHtml, leagueId);
        //console.log('Fetched Division Data:', divisionData); // Log the HTML content
        
        //const teams = await extractTeams(divisionHtml, division.name);
        //console.log(division.name, 'Teams: ', teams);
        
        //const meets = await extractMeets(divisionHtml, teams, division.name);
        //console.log(division.name, 'Meets: ', meets);

        //integrateTeamsAndMeets(teams, meets);

        //division.teams = teams;
        //division.meets = meets;

        console.log(" returning division ", division, " teams: ", teams.map(t => t.abbr));
        
        return division;
    } catch (error) {
        console.error(`Error in pullDivisionalHtml: ${error.message}`);
        return null;
    }
}

async function fetchMeet(week, teams, meetSchedule) {
    const name = `${teams[0].abbr}-${teams[1].abbr}`;
    const meet = await fetch(`http://localhost:4000/api/meet/${week}/${name}`);
    const season = get(seasonStore);

    if (!meet.ok) return false;
    
    meetSchedule.get(week).add(teams[0]).add(teams[1]);
    const meetText = await meet.text();
    const resultsFile = extractMeet(meetText);

    const queryProps = {
        name: 'Week ' + week + 'A - ' + teams.map(team => team.name).join(' at '),
        abbr: week + 'A - ' + name.replace('-', 'v'),
        startDate: season.weeks[week - 1],
        endDate: season.weeks[week - 1],
        divisionName: teams[0].divisionName,
        seasonId: season.objectId
    }

    const meetProps = {
        ...queryProps,
        teamIds: teams.map(team => team.objectId),
        entriesFiles: [null, null],
        is_official: true,
        resultsFiles: [{name: queryProps.name + ' Results.html', contents: resultsFile}]
    };

    const existingMeet = await checkIfObjectExists('Meet', queryProps);
    if (existingMeet) {
        console.log(`Meet ${queryProps.name} on ${queryProps.startDate} already exists`);
        return existingMeet;
    } else {
        const newMeet = await newParseObject('Meet', meetProps);
        console.log(newMeet);
        return newMeet;
    }
}

async function fetchDivisionHtml(divisionName) {
    try {
        const response = await fetch(`http://localhost:4000/api/division/${divisionName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const divisionHtml = await response.text();
        return divisionHtml;
    } catch (err) {
        const error = `Failed to fetch division data: ${err.message}`;
        console.error(error);
        throw err; // Rethrow the error to be caught in the calling function
    }
}

async function extractTeamsFromMeetResults(htmlString, leagueId) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlString, 'text/html');

    let divisions = [];
    let teamsByDivision = {}; // Object where division names are keys and team arrays are values

    let rows = doc.querySelectorAll('table.is-bordered.is-hoverable.is-narrow tr');

    let currentDivision = null;

    for (let row of rows) {
        let divisionHeader = row.querySelector('th[colspan="2"] a'); // Find division name

        if (divisionHeader) {
            // Extract division name (e.g., "Division A")
            currentDivision = divisionHeader.textContent.trim().split(' ')[1];
            divisions.push(currentDivision);
            teamsByDivision[currentDivision] = []; // Initialize empty team array
        } else if (currentDivision) {
            let teamCell = row.querySelector('td:first-child'); // Get team name
            if (teamCell) {
                let teamFullText = teamCell.textContent.trim();
                
                // Extract team name and abbreviation using regex
                let match = teamFullText.match(/^(.*)\s\(([^)]+)\)$/);
                let teamName = match ? match[1].trim() : teamFullText;
                let teamAbbr = match ? match[2].trim() : '';

                if (teamAbbr != '') {
                    // Create team object
                    let queryProps = {
                        leagueId: leagueId,
                        abbr: teamAbbr
                    };
                    try {
                        let existingTeam = await checkIfObjectExists('Team', queryProps);
                        if (existingTeam) {
                            console.log(`Team ${teamAbbr} already exists`);
                            //teams.push(existingTeam);
                        } else {
                            let teamProps = {
                                name: teamName,
                                abbr: teamAbbr,
                                mascot: '',
                                divisionName: currentDivision,
                                leagueId: leagueId
                            };
        
                            let newTeam = await newParseObject('Team', teamProps);
                            //teams.push(newTeam);
                            console.log(teamProps, 'newTeam');
                        }
                    } catch (error) {
                        console.error('Error while checking or creating team:', error);
                    }
                }
            }
        }
    };
}

// Usage example for Teams
async function extractTeams(htmlString, divisionName) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlString, 'text/html');
    let teamOptions = doc.querySelectorAll('#select-team option');
    let teams = [];
    const season = get(seasonStore);

    console.log(leagueId);

    for (let option of teamOptions) {
        if (option.value) {
            let teamName = option.textContent.split(' - ')[1];
            let teamAbbr = option.value;

            let queryProps = {
                leagueId: season.leaguId,
                abbr: teamAbbr
            };

            try {
                let existingTeam = await checkIfObjectExists('Team', queryProps);
                if (existingTeam) {
                    console.log(`Team ${teamAbbr} already exists`);
                    teams.push(existingTeam);
                } else {
                    let teamProps = {
                        name: teamName,
                        abbr: teamAbbr,
                        mascot: '',
                        divisionName: divisionName,
                        leagueId: leagueId
                    };

                    let newTeam = await newParseObject('Team', teamProps);
                    teams.push(newTeam);
                    console.log(teamProps, newTeam);
                }
            } catch (error) {
                console.error('Error while checking or creating team:', error);
            }
        }
    }

    return teams;
}

async function extractMeets(htmlString, teamsArray, divisionName) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlString, 'text/html');
    let meets = [];
    let meetRows = doc.querySelectorAll('#info-table .box:nth-child(2) tbody > tr');

    const season = get(seasonStore);

    for (let row of meetRows) {
        let dateString = row.querySelector('td').textContent.trim();
        
        if (dateString.startsWith('Week')) {
            let [abbr, date] = parseWeekDateString(dateString);
            let meetDetailsTable = row.querySelector('td.p-0 > table > tbody');
            let meetDetails = meetDetailsTable.querySelectorAll('tr');
            
            for (let detail of meetDetails) {
                let meetInfo = detail.querySelector('td').innerHTML;

                let teamAbbrs = [...meetInfo.matchAll(/team=([A-Z]{2,3})/g)].map(m => m[1]);

                let meetTeams = teamAbbrs.map((abbr) => {
                    let team = teamsArray.find(team => team.abbr === abbr);
                    return team;
                });

                console.log(teamAbbrs, teamsArray, meetTeams);

                let meetName = 'Week ' + abbr + ' - ' + meetTeams.map(team => team.name).join(' at ');
                let meetAbbr = abbr + ' - ' + meetTeams.map(team => team.abbr).join('v');

                // Check if the meet already exists
                let queryProps = {
                    name: meetName,
                    meet_date: date
                };

                let existingMeet = await checkIfObjectExists('Meet', queryProps);
                if (existingMeet) {
                    console.log(`Meet ${meetName} on ${date} already exists`);
                    meets.push(existingMeet);
                } else {
                    let meetProps = {
                        name: meetName,
                        abbr: meetAbbr,
                        date: date,
                        divisionName: divisionName,
                        seasonId: season.objectId,
                        teamIds: meetTeams.map(team => team.objectId),
                        entriesFiles: [null, null],
                        is_official: true
                    };

                    let newMeet = await newParseObject('Meet', meetProps);
                    meets.push(newMeet);
                }

                console.log(meets);
            }
        }
    }

    return meets;
}

function parseWeekDateString(dateString) {
    const weekMatch = dateString.match(/Week (\d+)/);
    const weekNumber = weekMatch ? weekMatch[1] : null;

    const dateMatch = dateString.match(/\(([^)]+)\)/);
    const datePart = dateMatch ? dateMatch[1] : null;

    if (weekNumber && datePart) {
        const abbr = `${weekNumber}A`;

        const date = new Date(datePart);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        const formattedDate = `${month}${day}${year}`;

        return [abbr, formattedDate];
    }

    return null;
}

export default pullDivisionalHtml;


