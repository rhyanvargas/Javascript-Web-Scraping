const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./creds.json');

module.exports = class Sheet {
    constructor () {
        this.doc = new GoogleSpreadsheet('1nR-NPA7ZJcitonuH9O6F92t6-88VwLoLbhqqEiZeFug');
    }
    async load() {
        await this.doc.useServiceAccountAuth(creds);
        await this.doc.loadInfo();
    }
    async addRows(rows) {
        const sheet = await this.doc.sheetsByIndex[0];
        await sheet.addRows(rows);
        console.log(`Added: ${rows.length} Rows!`);
    }    
}
