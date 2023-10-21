const cheerio = require('cheerio');

const getTimetable = (from, to, client) => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]
  
    const parser = data => {
      const $ = cheerio.load(data)
  
      const html_table = $('table.decorated.plan-lekcji')
      if (!html_table) {
        return null
      }
  
      const hours = []
      const table = Object.fromEntries(days.map(day => [day, []]))
  
      html_table.find('tr.line1')
        .each((idx, row) => {
          hours.push($(row).find('th').trim())
  
          $(row).find('td.line1').each((i, cell) => {
            const title = $(cell).find(".text").trim() || $(cell).trim()
            const insideData = {
              firstField: null,
              secondField: null,
            }
  
            const hasFlag = $(cell).find("s").length === 4
            if (hasFlag) {
              const firstField = {
                flag:
                  $(cell).children().eq(1).trim() ||
                  $(cell).children().eq(1).first().trim(),
                title: $(cell).find(".text").first().trim(),
              }
  
              const secondField = {
                flag:
                  $(cell).children().eq(3).trim() ||
                  $(cell).children().eq(3).first().trim(),
                title: $(cell).find(".text").last().trim(),
              };
  
              insideData.firstField = firstField;
              insideData.secondField =
                $(cell).find(".text").length > 1 ? secondField : null;
            }
  
            const key = days[i]
            table[key].push(!title ? null : {
              title,
              flag:
                $(cell).find(".center.plan-lekcji-info.tooltip").trim() ||
                $(cell).find(".center.plan-lekcji-info").trim(),
              insideFields: insideData
            })
            
          })
        })
      
      return {
        hours,
        table
      }
    }
  
    return client._request("post",
      "przegladaj_plan_lekcji", {
      form: { tydzien: `${from}_${to}` }
    })
      .then(d => parser(d.html()))
}
module.exports = { getTimetable };