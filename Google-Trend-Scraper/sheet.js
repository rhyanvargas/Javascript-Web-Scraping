const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../creds.json');

module.exports = class Sheet {
    constructor () {
        this.doc = new GoogleSpreadsheet('1JljTrLr2x3V05wt7zrSgoR6bNnG5zqJD3a6QIVUWKFY');
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
