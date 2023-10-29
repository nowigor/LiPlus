const cheerio = require('cheerio')

function getEvent(id, isAbsence, client) {
    if (isAbsence) {
        return client.api._tableMapper(
            `terminarz/szczegoly_wolne/${id}`,
            "table.decorated.small.center tbody",
            ["teacher", "range", "added"]
        )
    }
    else {
        const parser = data => {
            const $ = cheerio.load(data)

            const html_table = $('table.decorated.medium.center')
            if (!html_table) {
                return null
            }

            const table = {}
            html_table.find('tbody > tr').each((idx, row) => {
                const key = $(row).find("th").trim()
                const value = $(row).find("td").trim()

                table[key] = value
            })
            
            return table
        }

        return client._request("post",
            `terminarz/szczegoly/${id}`
        ).then(d => parser(d.html()))
    }
}

module.exports = {
    getEvent
}
