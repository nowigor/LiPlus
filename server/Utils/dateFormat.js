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

module.exports = {
    weekOfDay,
    formatDay
}