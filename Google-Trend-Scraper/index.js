const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');

(async function() {

    const res = await fetch('https://explodingtopics.com/featured-topics-this-month')
    const text = await res.text();
    const $ = cheerio.load(text);
    const containers = $('.topicInfoContainer').toArray();

    const trends = containers.map( c => {
        // Convert into DOM object
        const active = $(c);

        // Split data
        const keyword = active.find('.tileKeyword').text();
        const description = active.find('.tileDescription').text();
        const searches = active.find('.scoreTag').first().text().includes('searches') ?active.find('.scoreTag').first().text() : 'N/A' ;
        const growth = active.find('.scoreTag').next().text().includes('growth') ? active.find('.scoreTag').next().text() : active.find('.scoreTag').first().text();


        return { keyword, description, searches, growth}
    })
    
    // add to rows gsheet
    const sheet = new Sheet();
    await sheet.load();
    await sheet.addRows(rows);


})();