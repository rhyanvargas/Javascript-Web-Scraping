const Sheet = require('./sheet');
const fetch = require('node-fetch');

let pageNumber = 1;
let githubRoot =
    "https://jobs.github.com/positions.json";
    

async function scrapePage(pageNumber,location) {

    location = typeof location !== "undefined" ? location : "";

    let url = `${githubRoot}?page=${pageNumber}&location=${location}`;
    
    // get data in JSON 
    const res = await fetch(url);
    const json = await res.json();

    // map to data model
    var rows = await json.map(job => {
        return {
            company: job.company,
            url: job.url,
            title: job.title,
            location: job.location,
            type: job.type,
            date: job.created_at,
        }
    })

    return rows;
}

(async function addAllPaginatedJobs() {
    let i = 1;
    let rows = [];
    while (true) {
        let newRows = await scrapePage(i, "remote");
        if (newRows.length == 0) {
            console.log("Page: " + i)
            break;
        }
        rows = rows.concat(newRows);
        i++;
    }

    // sort by latest date
    rows = await rows.sort((a,b)=> new Date(b.date) - new Date(a.date));

    // add to rows gsheet
    const sheet = new Sheet();
    await sheet.load();
    await sheet.addRows(rows);

})();