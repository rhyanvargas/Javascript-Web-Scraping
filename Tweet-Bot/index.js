require('dotenv').config();
const Twitter = require('twitter');
const Sheet = require('./sheet');

(async function() {
	// connet to twitter api
	const client = new Twitter({
		consumer_key: process.env.API_KEY,
		consumer_secret: process.env.SECRET,
		access_token_key: process.env.ACCESS_TOKEN,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	});

	//  pull tweet from spreadsheet
	const sheet = new Sheet();
	await sheet.load();
	const quotes = await sheet.getRows();
	var status = quotes[0].quote; // 'saint quote'

	// send tweet
	client.post("statuses/update", { status }, function (error, tweet, response) {
		if (!error) {
			console.log(tweet);
		}
    });
    
	// remove quote
	await quotes[0].delete();

	console.log("tweeted", quotes[0].quote);
})();
