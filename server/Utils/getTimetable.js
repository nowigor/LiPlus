const cheerio = require('cheerio');

const getTimetable = (from, to, client) => {
  const parser = data => {
    const $ = cheerio.load(data)

    const html_table = $('table.decorated.plan-lekcji')
    if (!html_table.length) {
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
          const tooltip = $(cell).find("a").first()
  
          if (flag && tooltip.length) {
            const flag_map = {}

            tooltip.attr("title").split("<br>").forEach(e => {
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
              name = Przedmiot[1] ? Przedmiot[1].trim() : Przedmiot[0].trim()
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

          const check_if_window = () => {
            if (idx && table[i].at(-1)) {
              return {
                name: 'Okienko',
                teacher: null,
                room: null,
                from: start,
                to: end,
                active: true,
                flag: '',
                old: {}
              }
            }
            return null
          }
  
          table[i].push(!title ? check_if_window() : {
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
    
    for (let i = 0; i < 5; i++) {
      for (let j = table[i].length - 1; j > 0; j--) {
        if (table[i][j - 1].name === 'Okienko') {
          table[i][j] = null
        } else {
          table[i][j] = null
          break
        }
      }
    }
    
    return table
  }


  return client._request("post",
    "przegladaj_plan_lekcji", {
    form: { tydzien: `${from}_${to}` }
  })
    .then(d => parser(d.html()))
}
module.exports = { getTimetable };