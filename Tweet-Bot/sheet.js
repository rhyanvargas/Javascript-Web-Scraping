const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../creds.json');

module.exports = class Sheet {
    constructor () {
        this.doc = new GoogleSpreadsheet('1iVUHtXzjLvvTFtOJsFg-BFy6vxLIuEEUFoD1LUrT2ns');
    }
    async load() {
        await this.doc.useServiceAccountAuth(creds);
        await this.doc.loadInfo();
    }
    async getRows() {
        const sheet = await this.doc.sheetsByIndex[0]; 
        // read rows
        return await sheet.getRows(); // can pass in { limit, offset }
    }
}
