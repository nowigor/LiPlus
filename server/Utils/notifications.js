const { weekOfDay, formatDay } = require('./dateFormat')

function getCommonNotifications(client) {
    return new Promise(resolve => {
        const notifications = []
        const promises = []

        client.calendar.getCalendar().then(data => {
            data = data.slice(0).flat().filter(e => e.id !== -1)
        
            data.forEach(event => {
                promises.push(client.calendar.getEvent(event.id))
            })

            const {
                monday,
                sunday
            } = weekOfDay(new Date())

            client.homework.listHomework(-1, monday, sunday).then(data => {
                data.forEach(event => {
                    promises.push(client.homework.getHomework(event.id))
                })

                Promise.all(promises).then(notifs => {
                    notifs.forEach(notif => {
                        // handle test
                        if (Object.hasOwn(notif, 'Przedmiot')) {
                            notifications.push({
                                importance: 2,
                                title: notif.Rodzaj,
                                subject: notif.Przedmiot,
                                topic: notif.Opis,
                                description: `Za ileś dni masz ${notif.Rodzaj} z ${notif.Przedmiot}`,
                                expiry_date: notif.Data,
                                category: notif.Rodzaj,
                                icon: "red_warning",
                            })
                        } // handle homework
                        else {
                            const [_, subject, __] = notif.user.split(',')
                            notifications.push({
                                importance: 1,
                                title: "Zadanie domowe",
                                subject: subject.trim(),
                                topic: notif.title,
                                description: notif.content.replaceAll('\n', ' '),
                                expiry_date: notif.to,
                                category: 'Zadanie domowe',
                                icon: 'yellow_warning'
                            })
                        }
                    })
                    resolve(notifications)
                })
            })
        })
    })
}

module.exports = {
    getCommonNotifications
}