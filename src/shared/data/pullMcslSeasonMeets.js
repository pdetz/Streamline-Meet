import { checkIfObjectExists, newParseObject, queryParseObjects, upsertParseObjectByProps } from "./ParseHelpers";

async function pullMcslSeasonMeets(divisionName, season) {
    console.log("Pulling division data for:", divisionName);

    try {
        // Fetch the HTML content from the server-side API
        console.log('Fetching for division: ', divisionName);
        const response = await fetch(`http://localhost:4000/api/division/${divisionName}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the HTML content as a string
        const fullHtml = await response.text();

        // Parse the HTML content using the client-side parser function
        parseMcslSeasonMeetsTableHtml(fullHtml, divisionName, season);

        // Return the data in the specified format: { division: [ {name: ..., abbr: ...} ] }
        //return formattedData;

    } catch (err) {
        const error = `Failed to fetch or parse division data: ${err.message}`;
        console.error(error);
        throw err; // Rethrow the error to be caught in the calling function
    }
}

async function parseMcslSeasonMeetsTableHtml(htmlString, divisionName, season) {
  // Create a temporary DOM element to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const weeks = season.get('weeks');
  const division = season.get('divisionAssignments')[divisionName];

  // Find the #info-table element and then the table within it
  const infoTableDiv = doc.querySelector('#info-table');
  if (!infoTableDiv) {
    console.error('Error: #info-table div not found in the provided HTML string.');
    return null;
  }

  const table = infoTableDiv.querySelectorAll('table')[1];
  if (!table) {
    console.error('Error: Table not found within #info-table in the provided HTML string.');
    return null;
  }

  console.log('table', table);

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll(':scope > tr'));

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('td'));
    const n = cells[0].innerText.trim().split(' ')[1];
    const date = weeks[n - 1];

    const meetCell = cells[1];
    const meets = Array.from(meetCell.querySelectorAll('td'));

    for (const meet of meets) {
        const teamNames = Array.from(meet.querySelectorAll('a')).map(a => a.innerText);

        const teams = teamNames.map(teamName => {
          return division.find(t => t.name === teamName);
        });

        console.log('teams', teams);

        const newMeet = {
          meetType: 'A',
          name: `Week ${n}A - ${teamNames[0]} at ${teamNames[1]}`,
          abbr: `${n}A - ${teams[0].abbr}-${teams[1].abbr}`,
          is_official: true,
          seasonId: season.id,
          divisionName: divisionName
        }
        const updateProps = {
          entriesFiles: teams.map(team => null),
          resultsFiles: [null],
          teamIds: teams.map(team => team.objectId),
          endDate: date,
          startDate: date
        };
        await upsertParseObjectByProps('Meet', newMeet, updateProps);
        console.log(newMeet);
    }
  }
}

/*
Meet = {
  meetType: 'A',
  name: 'Week NA - Team 1 at Team 2',
  abbr: NA - T1-T2,
  is_official: true,
  seasonId: ffyzkOrf4W,
  divisionName: X,
  teamIds: ['t1.objectId', 't2.objectId'],
  endDate: ---,
  startDate: ---
}
*/

export { pullMcslSeasonMeets };