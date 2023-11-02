function weekOfDay(day) {
    const {
        monday,
        sunday
    } = _week_range(day)

    return {
        monday: formatDay(monday),
        sunday: formatDay(sunday)
    }
}

function formatDay(day) {
    if (typeof day === 'string' || day instanceof String) {
        return day
    }

    const y = day.getFullYear()
    const m = (day.getMonth() + 1).toString().padStart(2, '0')
    const d = day.getDate().toString().padStart(2, '0')

    return `${y}-${m}-${d}`
}

function _week_range(day) {
    const day_number = (day.getDay() + 6) % 7

    const monday = new Date(day)
    monday.setDate(monday.getDate() - day_number)

    const sunday = new Date(day)
    sunday.setDate(sunday.getDate() + 6 - day_number)

    return {
        monday,
        sunday
    }
}

function dateInDays(n, date = null) {
    const today = date ? new Date(date) : new Date()

    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)
}

function daysRemaining(date) {
    date = new Date(date)
    const diff = Math.abs(new Date() - date)
    
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function isLater(t1, t2) {
    const date1 = new Date(`1970-01-01T${t1}:00`)
    const date2 = new Date(`1970-01-01T${t2}:00`)

    return date1 >= date2
}

module.exports = {
    weekOfDay,
    formatDay,
    dateInDays,
    daysRemaining,
    isLater
}