import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom'; // For Node.js HTML parsing

async function scrapeMeetResults(week, name) {
    const url = `https://mcsl.org/display-results-dual/2024/week${week}/${name}`;
    console.log(`Scraping meet results from: ${url}`);
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const response = await page.goto(url, { waitUntil: 'networkidle2' });

        if (response.status() === 404) {
            console.log(`Meet not found (404): ${name} in week ${week}`);
            return null; // Return null for 404
        }

        const content = await page.content(); // Get the full HTML content
        return content;
    } catch (error) {
        console.error(`Error scraping meet ${name} week ${week}:`, error);
        throw new Error(`Failed to scrape meet ${name} week ${week}: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

async function scrapeDivisionInfo(divisionLetter) {
    const url = `https://mcsl.org/team-division-info/`;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('#select-division');

        await page.select('#select-division', divisionLetter);
        await page.waitForSelector('#info-table table', { timeout: 15000 });

        // Extract only the outer HTML of the #info-table element
        const content = await page.$eval('#info-table', element => element.outerHTML);
        return content;
    } catch (error) {
        console.error(`Error scraping division ${divisionLetter} info:`, error);
        throw new Error(`Failed to scrape division ${divisionLetter}: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

/**
 * Scrapes divisional meet results from mcsl.org.
 * @returns {Promise<string>} - The raw HTML of the divisionals content.
 */
async function scrapeDivisionals() {
    const url = 'https://mcsl.org/meet-results/';
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Select "Divisionals" in the meet dropdown
        await page.select('#select-meet', 'divisionals');

        // Manually trigger the change event so HTMX updates the content
        await page.evaluate(() => {
            document.querySelector('#select-meet').dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Wait for HTMX to finish updating the #info-table content
        await page.waitForResponse((response) =>
            response.url().includes('/api/meet-results/') && response.status() === 200
        );

        // Wait for #info-table to be populated
        await page.waitForSelector('#info-table:not(:empty)', { timeout: 15000 });

        // Extract the updated HTML, similar to your original `res.send('test4' + content);`
        // Note: 'test4' was a prefix in your old server route. We'll just return the content here.
        const content = await page.content();
        return content;
    } catch (error) {
        console.error('Error scraping divisionals:', error);
        throw new Error(`Failed to scrape divisionals: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

function extractMeet(fullHtml) {
    const dom = new JSDOM(fullHtml);
    const doc = dom.window.document;

    const h2Element = doc.querySelector('h2');
    const footerElement = doc.querySelector('footer');

    if (!h2Element || !footerElement) {
        console.error('No <h2> or <footer> tag found for meet content extraction.');
        return ''; // Return an empty string if elements are not found
    }

    const tempDiv = doc.createElement('div');
    let currentNode = h2Element;
    while (currentNode && currentNode !== footerElement) {
        const nextNode = currentNode.nextSibling;
        tempDiv.appendChild(currentNode);
        currentNode = nextNode;
    }
    if (footerElement) {
        tempDiv.appendChild(footerElement);
    }

    return tempDiv.innerHTML;
}

export { scrapeMeetResults, scrapeDivisionInfo, scrapeDivisionals, extractMeet };