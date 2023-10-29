const cheerio = require('cheerio');

const getTimetable = (from, to, client) => {
    const parser = data => {
      const $ = cheerio.load(data)
  
      const html_table = $('table.decorated.plan-lekcji')
      if (!html_table) {
        return null
      }
  
      const table = Array.from({ length: 7 }, () => [])
  
      html_table.find('tr.line1')
        .each((idx, row) => {
          const lesson_number = $(row).find('td.center').first().trim()
          const [start, end] = $(row).find('th').trim().split('-')
  
          $(row).find('td.line1').each((i, cell) => {
            const title = $(cell).find(".text").first().trim() || $(cell).trim()

            const room_position = title.indexOf('s.') !== -1 ? title.indexOf('s.') : title.length
            let name = title.substring(0, title.indexOf('-')).trim()
            let teacher = title.substring(title.indexOf('-') + 1, room_position).trim()
            let room = title.substring(room_position + 2).trim()

            const flag = $(cell).find(".center.plan-lekcji-info:not(.tooltip)").first().trim()
            let active = flag.includes("nieobecność") || flag.includes("dzień wolny") ?
              false : true
            
            const old = {}
  
            if (flag) {
              const raw_text = $(cell).find("a").first().attr("title").split("<br>")
              const flag_map = {}

              raw_text.forEach(e => {
                const match = e.match(/<b>(.*?)<\/b>\s(.*?)$/)
                if (match) {
                  flag_map[match[1]] = match[2]
                }
              })

              const Przedmiot = flag_map['Przedmiot:'].split('->')
              const Nauczyciel = flag_map['Nauczyciel:'].split('->')
              const Sala = flag_map['Sala:'].split('->')
              const moved_class = (flag_map['Nr lekcji:'].split('->')[0].trim() === lesson_number)

              if (flag === 'zastępstwo') {
                name = Przedmiot[1].trim()
                teacher = Nauczyciel[1].trim()
                room = Sala[1].trim()

                old.name = Przedmiot[0].trim()
                old.teacher = Nauczyciel[0].trim()
                old.room = Sala[0].trim()
              }
              else if (flag === 'przesunięcie') {
                old.name = name
                old.teacher = teacher
                old.room = Sala[0].trim()

                name = Przedmiot[0].trim()
                teacher = Nauczyciel[0].trim()
                room = Sala[1].trim()
                active = !moved_class
              }
              else if (flag === 'odwołane') {
                active = false
              }
            }
  
            table[i].push(!title ? null : {
              name,
              teacher,
              room,
              from: start.trim(),
              to: end.trim(),
              active,
              flag,
              old
            })
            
          })
        })
      
      return table
    }
  
    return client._request("post",
      "przegladaj_plan_lekcji", {
      form: { tydzien: `${from}_${to}` }
    })
      .then(d => parser(d.html()))
}
module.exports = { getTimetable };