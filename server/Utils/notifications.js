const { weekOfDay, formatDay, dateInDays, daysRemaining, isLater } = require('./dateFormat')
const { getGrades } = require('./getGrades')

function getCommonNotifications(client) {
    const today = new Date()
    const month = today.getMonth() + 1
    const next_month = (month + 1) % 12

    const {
        monday,
        sunday
    } = weekOfDay(today)
    
    return Promise.all([
        client.calendar.getCalendar(month),
        client.calendar.getCalendar(next_month),
        client.homework.listHomework(-1, monday, sunday),
    ]).then(([calendar1, calendar2, homework]) => {
        const calendar_promises = [
            ...calendar1.slice(today.getDate()).flat().filter(e => e.id !== -1).map(e => client.calendar.getEvent(e.id, e.title)),
            ...calendar2.slice(0, today.getDate()).flat().filter(e => e.id !== -1).map(e => client.calendar.getEvent(e.id, e.title))
        ]

        const homework_promises = homework.map(e => client.homework.getHomework(e.id))

        return Promise.all([...calendar_promises, ...homework_promises])
    }).then(notifs => {
        const notifications = notifs.filter(n => !Object.hasOwn(n, 'Wolne')).map(n => {
            if (!Object.hasOwn(n, 'user')) {
                return {
                    importance: 2,
                    title: n.Rodzaj,
                    subject: n.Przedmiot,
                    topic: n.Opis,
                    days: daysRemaining(n.Data),
                    description: `Za ${daysRemaining(n.Data)} dni masz ${n.Rodzaj} ${n.Przedmiot ? `z ${n.Przedmiot}` : '[brak przedmiotu]'}`,
                    date: n.Data,
                    category: n.Rodzaj.toLowerCase(),
                    icon: 'red_warning'
                }
            } else {
                const [_, subject, __] = n.user.split(',')
                return {
                    importance: 0,
                    title: 'Zadanie domowe',
                    subject: subject.trim(),
                    topic: n.title,
                    description: n.content.replaceAll('\n', ','),
                    days: daysRemaining(n.to),
                    date: n.to,
                    category: 'zadanie domowe',
                    icon: 'green_backpack'
                }
            }
        })

        return notifications
    })
}

function getMiscNotifications(client) {
    const today = new Date()
    const prev_week = dateInDays(-7)
    const next_week = dateInDays(+7)

    const [
        prev_monday, prev_sunday,
        monday, sunday,
        next_monday, next_sunday
    ] = [...Object.values(weekOfDay(prev_week)),
         ...Object.values(weekOfDay(today)),
         ...Object.values(weekOfDay(next_week))]
    
    return Promise.all([
        client.calendar.getTimetable(prev_monday, prev_sunday),
        client.calendar.getTimetable(monday, sunday),
        client.calendar.getTimetable(next_monday, next_sunday)
    ]).then(([prev_week, this_week, next_week]) => {
        if (!prev_week || !this_week || !next_week) return null

        const length = this_week[(today.getDay() + 6) % 7].length
        const day_number = (today.getDay() + 6) % 7

        const classes = (prev_week.concat(this_week).concat(next_week)).flat()
        const index = this_week[day_number].findIndex(e => e !== null) + length * (day_number + 7)
        const previous = classes.slice(0, index)
        const next = classes.slice(index)

        let next_day_index = day_number < 4 ? day_number + 1 : 0
        let tmrw_lessons = next_day_index ? next_week[0].filter(e => e) : this_week[next_day_index].filter(e => e)
        let tmrw_windows = tmrw_lessons.filter(e => e.name === 'Okienko')
        let is_today = false
        
        if (parseInt(classes[index].from) <= today.getHours()) {
            previous.push(next.shift())
            is_today = true
            tmrw_lessons = this_week[day_number].filter(e => e)
            tmrw_windows = tmrw_lessons.filter(e => e.name === 'Okienko')
        }

        const p_index = previous.length - 1 - previous.reverse().findIndex(e => e && e.name === 'Wychowanie fizyczne')
        const n_index = previous.length + next.findIndex(e => e && e.name === 'Wychowanie fizyczne')

        return [{
            importance: 0,
            title: 'Spakuj strój na WF',
            subject: null,
            topic: null,
            description: `Za ${parseInt(n_index / 13) - day_number} dni masz WF. Spakuj strój.`,
            days: parseInt(n_index / 13) - day_number,
            date: formatDay(dateInDays(parseInt(n_index / 13) - day_number)),
            category: 'spakuj wf',
            icon: 'blue_wf'
        }, {
            importance: 0,
            title: 'Wypierz struj na WF',
            subject: null,
            topic: null,
            description: `${Math.abs(day_number - parseInt(p_index / 13))} dni temu miałeś WF. Wypierz struj.`,
            days: day_number - parseInt(p_index / 13),
            date: formatDay(dateInDays(-(day_number - parseInt(p_index / 13)))),
            category: 'wypierz wf',
            icon: 'blue_wf'
        }, {
            importance: 0,
            title: 'Spakuj jedzenie',
            subject: null,
            topic: null,
            description: `${is_today ? 'Dzisiaj' : 'Jutro'} masz ${tmrw_lessons.length} godzin, w tym ${tmrw_windows.length} okienek. Spakuj odpowiednią ilość jedzenia.`,
            days: is_today ? 0 : (!next_day_index ? 3 : 1),
            date: formatDay(is_today ? today : dateInDays(!next_day_index ? +3 : +1)),
            category: 'jedzenie',
            icon: 'blue_food'
        }, {
            importance: 0,
            title: 'Naładuj i spakuj laptopa',
            subject: tmrw_lessons.filter((v, i) => tmrw_lessons.indexOf(v) === i).map(e => e.name),
            topic: null,
            description: `Naładuj i spakuj na ${is_today ? 'dzisiaj' : 'jutro'} laptopa.`,
            days: is_today ? 0 : (!next_day_index ? 3 : 1),
            date: formatDay(is_today ? today : dateInDays(!next_day_index ? +3 : +1)),
            category: 'laptop',
            icon: 'blue_laptop'
        }]
    })
}

function getGradeNotifications(client) {
    return getGrades(client).then(data => {
        if (!data) return null

        let grades = Object.values(data).reduce((all, e) => {
            all.push(...e.semester1.grades, ...e.semester2.grades)
            return all
        }, [])
        grades = grades.filter(e => e.Id !== null && parseInt(e.Ocena) !== 6)
        
        const notifications = []
        for (const grade of grades) {
            const correction_time = 21
            const day_difference = daysRemaining(grade.Data)
            const days_remaining = correction_time - day_difference

            if (day_difference <= correction_time) {
                notifications.push({
                    importance: days_remaining < 3 ? 2 : 1,
                    title: `Popraw ocenę (${grade.Ocena})`,
                    subject: grade.Przedmiot,
                    topic: grade.Kategoria,
                    description: `Zostało Ci ${days_remaining} ${days_remaining === 1 ? 'dzień' : 'dni'} żeby poprawić ${grade.Ocena} z ${grade.Przedmiot}`,
                    days: days_remaining,
                    date: formatDay(dateInDays(correction_time, grade.Data)),
                    category: 'poprawa',
                    icon: days_remaining < 3 ? 'red_test' : 'yellow_test'
                })
            }
        }
        return notifications
    })
}

function getLessonNotifications(date, client) {
    const today = new Date(date)
    const date_number = today.getDate()
    const month_number = today.getMonth() + 1

    const {
        monday,
        sunday
    } = weekOfDay(today)

    return Promise.all([
        client.calendar.getCalendar(month_number),
        client.homework.listHomework(-1, monday, sunday)
    ]).then(([calendar, homework]) => {
        calendar = calendar[date_number - 1].filter(e => e.id !== -1)
        homework = homework.filter(e => e.to === formatDay(today))
        
        const timetable_promise = client.calendar.getTimetable(monday, sunday)
        const calendar_promises = calendar.map(e => client.calendar.getEvent(e.id, e.title))
        const homework_promises = homework.map(e => client.homework.getHomework(e.id))

        return Promise.all([...calendar_promises, ...homework_promises, timetable_promise])
    }).then(notifs => {
        const timetable = notifs.pop()[(today.getDay() + 6) % 7]
        const notifications = Array.from({ length: timetable.length }, _ => [])
        
        notifs.forEach((n, i) => {
            if (Object.hasOwn(n, 'Nr lekcji')) {
                let i = parseInt(n['Nr lekcji'])

                if (!timetable[i] || timetable[i].name !== n.Przedmiot) {
                    for (let j = 0; j < timetable.length; j++) {
                        i = (i + 1) % timetable.length

                        if (timetable[i] && timetable[i].name === n.Przedmiot) {
                            break
                        }
                    }
                }

                notifications[i].push({
                    importance: 2,
                    title: n.Rodzaj,
                    topic: n.Opis,
                    icon: 'red_test'
                })
            } else if (Object.hasOwn(n, 'Przedział czasu')) {
                const [start, end] = n['Przedział czasu'].split('-')
                
                for (let i = 0; i < timetable.length; i++) {
                    if (timetable[i] && isLater(timetable[i].to, start.trim()) && isLater(end.trim(), timetable[i].from)) {
                        notifications[i].push({
                            importance: 1,
                            title: n.Rodzaj,
                            topic: n.Opis,
                            icon: 'yellow_test',
                        })
                    }
                }
            } else if (Object.hasOwn(n, 'user')) {
                const [_, subject, __] = n.user.split(',')

                for (let i = 0; i < timetable.length; i++) {
                    if (timetable[i] && timetable[i].name === subject.trim()) {
                        notifications[i].push({
                            importance: 1,
                            title: 'Zadanie domowe',
                            topic: n.title,
                            icon: 'yellow_test',
                        })
                        break
                    }
                }
            }
        })
        return notifications
    })
}

module.exports = {
    getCommonNotifications,
    getMiscNotifications,
    getGradeNotifications,
    getLessonNotifications,
}