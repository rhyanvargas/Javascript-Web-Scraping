const Sheet = require('./sheet');
const fetch = require('node-fetch');


async function scrapePage(pageNumber, title) {
    // get data in JSON 
    const res = await fetch(`https://jobs.github.com/positions.json?page=${pageNumber}?search=code`);
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

    // filter data 
    rows = await rows.filter(job => job.title.includes(title));

    return rows;
}

(async function addAllPaginatedJobs() {
    let i = 1;
    let rows = [];
    while (true) {
        let newRows = await scrapePage(i, 'Full');
        if (newRows.length == 0) {
            console.log("Page: " + i)
            break;
        }
        rows = rows.concat(newRows);
        i++;
    }
    
    // sort
    rows = await rows.sort((a,b)=> new Date(b.date) - new Date(a.date));
    
    // add to rows gsheet
    const sheet = new Sheet();
    await sheet.load();
    await sheet.addRows(rows);

})();



// var pageNumber = 1;

// while (scrapePage(pageNumber).length != null) {
//     console.log(pageNumber);
//     pageNumber ++;
// }


// (async function () {

//     // get data in JSON 
//     const res = await fetch('https://jobs.github.com/positions.json?page=1?search=code');
//     const json = await res.json();

//     // map to data model
//     var rows = json.map(job => {
//         return {
//             company: job.company,
//             url: job.url,
//             title: job.title,
//             location: job.location,
//             type: job.type,
//             date: job.created_at,
//         }
//     })

    // const sheet = new Sheet();
    // await sheet.load();
    // await sheet.addRows(rows);
