const cheerio = require('cheerio')

function getGrades(client) {
    const parser = data => {
        const $ = cheerio.load(data)
        const html_table = $('table.decorated.stretch:not([style])')
        if (!html_table.length) {
            return null
        }

        const dissect_grade = (grade, subject) => {
            if ($(grade).find("a").length === 0) {
                return {
                    Id: null,
                    Ocena: $(grade).trim(),
                    Przedmiot: subject
                }
            }

            const [previous, corrected] = $(grade).trim().replaceAll(/[\[\]]/g, '').trim().split('\n')
            const flag_map = {
                Id: $(grade).find("a").attr("href").split("/").at(-1),
                Ocena: corrected ? corrected.trim() : previous.trim(),
                Poprzednia: corrected ? previous.trim() : null,
                Przedmiot: subject
            }

            const title = $(grade).find("a").attr("title").replaceAll("<br/>", "").split("<br>")
            title.forEach(e => {
                const i = e.indexOf(':')
                if (e.slice(0, i) !== "Dodał") {
                    flag_map[e.slice(0, i)] = e.slice(i + 1).trim()
                }
            })
            flag_map.Data = flag_map.Data.split(' ')[0]

            return flag_map
        }

        const semester = (columns, start, subject, skip_average = false) => {
            const grades = $(columns[start]).find("> span").map((_, e) => dissect_grade(e, subject)).get()
            const average = $(columns[start + 1]).trim()
            const final = $(columns[start + 2]).trim()

            return skip_average ? {
                grades,
                average
            } : {
                grades,
                average,
                final
            }
        }

        const table = {}
        html_table.find("> tbody > tr[class*='line']:not([name])").each((idx, row) => {
            const columns = $(row).children("td").slice(1)
            const subject = $(columns[0]).trim()

            if (columns.length === 9) {
                table[subject] = {
                    semester1: semester(columns, 1, subject),
                    semester2: semester(columns, 4, subject),
                    average: $(columns[7]).trim(),
                    final: $(columns[8]).trim()
                }
            } else {
                table[subject] = {
                    semester1: semester(columns, 1, subject, true),
                    semester2: semester(columns, 3, subject, true),
                    average: $(columns[5]).trim(),
                    final: $(columns[5]).trim()
                }
            }
        })
        return table
    }

    return client._request("post",
        "przegladaj_oceny/uczen"
    ).then(d => parser(d.html()))
}

module.exports = {
    getGrades
}
