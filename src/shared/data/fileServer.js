import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

import puppeteer from 'puppeteer';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Enable CORS for the specified origin
app.use(cors({ origin: 'https://localhost:5173' }));

app.get('/api/divisionals/:letter', async (req, res) => {
  const division = req.params.letter;
  const url = 'https://mcsl.org/meet-results/';

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' }); // Ensure initial load completes

    // Monitor HTMX's request
    page.on('response', async (response) => {
      if (response.url().includes('/api/meet-results/')) {
        console.log('HTMX request detected:', response.url());
      }
    });

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
    await page.waitForSelector('#info-table:not(:empty)');

    // Extract the updated HTML
    const content = await page.content();

    await browser.close();
    res.send('test4' + content);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: `Error fetching data: ${error.message}` });
  }
});

app.get('/api/meet/:week/:name', async (req, res) => {
    const week = req.params.week;
    const name = req.params.name;
    const url = `https://mcsl.org/display-results-dual/2025/week${week}/${name}`;

    console.log(url);

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const response = await page.goto(url, { waitUntil: 'networkidle2' });

        // Check if the HTTP response status is 404
        if (response.status() === 404) {
            //console.log(`Meet not found: ${name} in week ${week}`);
            await browser.close();
            return res.sendStatus(404); // Return a proper 404 response with no content
        }

        // Extract the HTML content
        const content = await page.content();
        await browser.close();
        
        res.send(content); // Send the raw HTML as the response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send(`Error fetching data from ${url}`);
    }
});

app.get('/api/division/:letter', async (req, res) => {
  const division = req.params.letter;
  const url = `https://mcsl.org/team-division-info/`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#select-division');

    // Select the option in the dropdown based on the 'division' parameter
    // The first argument is the CSS selector for the <select> element.
    // The second argument is the value of the <option> to be selected.
    await page.select('#select-division', division);

    await page.waitForSelector('#info-table table', { timeout: 10000 }); // Increased timeout for robustness

    // Extract only the outer HTML of the #info-table element
    // page.$eval allows you to run a querySelector on the page and then
    // execute a function with the selected element as an argument.
    const content = await page.$eval('#info-table', element => element.outerHTML);

    await browser.close();
    res.send(content);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: `Error fetching data: ${error.message}` });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server listening on port 4000');
});