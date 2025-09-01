import File from "./files/File";

async function pullMcslMeetResults(meet) {
    console.log("Pulling results for meet:", meet.abbr);
    
    const week = meet.abbr[0];
    //const name = meet.teams.map(team => team.abbr).join('-');
    const name = meet.abbr.split(' - ')[1];
    console.log(`Week: ${week}, Name: ${name}`);
        const url = `https://mcsl.org/display-results-dual/2025/week${week}/${name}`;

    console.log(url);

    try {
        // Fetch the HTML content from the server-side API
        const response = await fetch(`http://localhost:4000/api/meet/${week}/${name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Get the HTML content as a string
        const fullHtml = await response.text();
        const meetHtml = extractMeet(fullHtml);
        return new File({
            name: meet.name + ' RESULTS.html',
            contents: meetHtml
        });        
} catch (err) {
        const error = `Failed to fetch meet results: ${err.message}`;
        console.error(error);
        throw err; // Rethrow the error to be caught in the calling function
    }
}

function extractMeet(fullHtml) {
    // Create a DOM parser to convert the HTML string into a document object
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullHtml, 'text/html');

    // Find the first <h2> element
    const h2Element = doc.querySelector('h2');
    if (!h2Element) {
        console.error('No <h2> tag found in the HTML.');
        return ''; // Return an empty string if no <h2> is found
    }

    // Find the <footer> element
    const footerElement = doc.querySelector('footer');
    if (!footerElement) {
        console.error('No <footer> tag found in the HTML.');
        return ''; // Return an empty string if no <footer> is found
    }

    // Create a range object and set it to select everything between <h2> and <footer>
    const range = document.createRange();
    range.setStartBefore(h2Element);
    range.setEndAfter(footerElement);

    // Extract the HTML content within the range
    const extractedContent = range.cloneContents();

    // Convert the DocumentFragment back to an HTML string
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(extractedContent);
    return tempDiv.innerHTML;
}

export { pullMcslMeetResults, extractMeet };