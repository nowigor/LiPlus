const cheerio = require('cheerio')

function getEvent(id, title, client) {
    const parser = (data, absence) => {
        const $ = cheerio.load(data)
        
        const html_table = $('table.decorated.center')
        if (!html_table.length) {
            if (!absence) {
                return client._request("post",
                    `terminarz/szczegoly_wolne/${id}`
                ).then(d => parser(d.html(), true))
            } else {
                return null
            }
        }

        const table = {}
        html_table.find('tbody > tr').each((_, row) => {
            const key = $(row).find('th').trim()
            const value = $(row).find('td').trim()

            if (key !== 'Zakres') {
                table[key] = value
            } else {
                const [from, to] = value.split(' - ')
                table.Od = from
                table.Do = to
                table.Wolne = title.slice(0, title.indexOf(':'))
            }
        })

        return table
    }

    return client._request("post",
        `terminarz/szczegoly/${id}`
    ).then(d => parser(d.html(), false))
}

module.exports = {
    getEvent
}
