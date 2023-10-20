const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");
const cheerio = require('cheerio');

const app = express();
app.use(cors());
const client = new Librus();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const PORT = process.env.PORT || 3030;

let login = null;
let password = null;
app.post('/user', (req, res) =>
{
  const {UserLogin, UserPassword} = req.body;
  login = UserLogin;
  password = UserPassword;
  authorize(res);
});

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

const authorize = (res) =>
{
  client.authorize(login, password).then(function () {
      getTimetable("2023-10-16", "2023-10-22", client).then((data) => {
        return res.status(201).json({status: "success", data: data});
      });
        // client.info.getGrades().then((data) => {console.log(data[14].semester[0].grades)});
  });
}


app.get('/', (req,res)=>{
  return res.status(200).json({content: "content"});
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
