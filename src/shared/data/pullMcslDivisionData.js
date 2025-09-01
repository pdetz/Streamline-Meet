import { queryParseObjects } from "./ParseHelpers";

async function pullMcslDivisionData(division) {
    console.log("Pulling division data for:", division);

    try {
        // Fetch the HTML content from the server-side API
        console.log('Fetching for division: ', division);
        const response = await fetch(`http://localhost:4000/api/division/${division}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the HTML content as a string
        const fullHtml = await response.text();

        // Parse the HTML content using the client-side parser function
        const parsedTableData = parseMcslDivisionTableHtml(fullHtml);

        if (!parsedTableData) {
            throw new Error("Failed to parse table data from HTML.");
        }

        const formattedDataPromises = parsedTableData.map(async team => {
            let objectId = null;
            try {
                const parseTeam = await queryParseObjects('Team', { abbr: team.Team });
                objectId = parseTeam[0].id;
            } catch (queryError) {
                console.error(`Error querying Parse for team ${team.Name || team.Team}:`, queryError);
                // Optionally handle the error, e.g., set objectId to a default or skip this team
            }

            return {
                name: team.Name || '', // Assuming 'Name' is the header for the full team name
                abbr: team.Team || '',  // Assuming 'Team' is the header for the team abbreviation
                objectId: objectId // Add the objectId to the team object
            };
        });

        // Wait for all the promises from the map operation to resolve
        const formattedData = await Promise.all(formattedDataPromises);
        console.log(formattedData);
        // Return the data in the specified format: { division: [ {name: ..., abbr: ...} ] }
        return formattedData;

    } catch (err) {
        const error = `Failed to fetch or parse division data: ${err.message}`;
        console.error(error);
        throw err; // Rethrow the error to be caught in the calling function
    }
}

function parseMcslDivisionTableHtml(htmlString) {
  // Create a temporary DOM element to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Find the #info-table element and then the table within it
  const infoTableDiv = doc.querySelector('#info-table');
  if (!infoTableDiv) {
    console.error('Error: #info-table div not found in the provided HTML string.');
    return null;
  }

  const table = infoTableDiv.querySelector('table');
  if (!table) {
    console.error('Error: Table not found within #info-table in the provided HTML string.');
    return null;
  }

  const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const data = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = cells[index] ? cells[index].innerText.trim() : '';
    });
    return rowObject;
  });

  return data;
}

export { pullMcslDivisionData };