const querystring = require('querystring')
const cheerio = require('cheerio')
const config = require('../node_modules/librus-api/lib/config.js')

function _request(method, apiFunction, data, caller) {
    const target = apiFunction.startsWith("https://")
        ? apiFunction
        : `${config.page_url}/${apiFunction}`
    
    if (method.toLowerCase() === "post" && data && data.form) {
        data = querystring.stringify(data.form)
    }

    return caller.request({
        method,
        url: target,
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(({ data }) => cheerio.load(data))
}

module.exports = {
    _request
}
