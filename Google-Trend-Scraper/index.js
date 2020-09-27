const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');


// Main
(async function() {

    baseURL = 'https://explodingtopics.com/featured-topics-this-month';

    const trends = await getAllPaginatedData(baseURL);

    await addRows(trends);
  
    // Update sheet (new and existing)

})();

// HELPER FUNCTIONS
async function scrapePage(baseURL) {
    // Get Data
    const res = await fetch(baseURL)
    const text = await res.text();
    const $ = cheerio.load(text);
    const containers = $('.topicInfoContainer').toArray();

    // Map Data
    const trends = containers.map( c => {
        // Convert into DOM object
        const active = $(c);
        // Map elements to data columns
        const keyword = active.find('.tileKeyword').text();
        const description = active.find('.tileDescription').text();
        const searchesPerMonth = active.find('.scoreTag').first().text().includes('searches') ? active.find('.scoreTag').first().text().split('mo')[1] : 'N/A' ;
        const growth = active.find('.scoreTag').next().text().includes('growth') ? active.find('.scoreTag').next().text() : active.find('.scoreTag').first().text();

        return { keyword, description, searchesPerMonth, growth}
    })

    return trends;
}

async function addRows(arr) {
    // add to rows gsheet
    const sheet = new Sheet();
    await sheet.load();
    await sheet.addRows(arr);
}

async function getAllPaginatedData(baseURL) {
    let page = 1;   
    let newArr = [];

    while(true) {
        let param = `?page=${page}`;
        let rows = await scrapePage(baseURL+param)
        // if rows length == 0 then break
        if(rows.length == 0) break;
        // else add to newArr
        newArr = newArr.concat(rows)
        // next page
        page++;
    }

    return newArr;
}