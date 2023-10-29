const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");
const cheerio = require('cheerio');

const { getTimetable } = require('./Utils/getTimetable');
const { formatDay, weekOfDay } = require('./Utils/dateFormat')
const { getEvent } = require('./Utils/getEvent')
const { getCommonNotifications } = require('./Utils/notifications')

//@ Server
const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//@ Client
const client = new Librus();
client.calendar.getTimetable = (start, end) => getTimetable(start, end, client)
client.calendar.getEvent = (id, isAbsence = false) => getEvent(id, isAbsence, client)


//@ User authentication
const authenticate = (res, user) => {
  client.authorize(user.login, user.password).then(result => {
    if (result) {
      return res.status(201).json({
        status: "success",
        data: "Zalogowano"
      })
    }
    else {
      return res.status(401).json({
        status: "error",
        data: "Nieudane logowanie"
      })
    }
  })
}


//@ User login/logout
app.post('/user/auth/login', (req, res) =>
{
  const {
    UserLogin,
    UserPassword
  } = req.body;

  authenticate(res, {
    login: UserLogin,
    password: UserPassword
  })
});

app.post('/user/auth/logut', (req, res) =>
{
  //TODO
  //+ Zrobić sposób na wylogowanie bo taki nie działa 
  authenticate(res, {
    login: null,
    password: null
  })
});



//@ Endpoints
app.post('/notifications/today', (req, res) => {
  getCommonNotifications(client).then(notifications => {
    //+ dodać powiadomienia o poprawie ocen
    res.status(201).json({
      status: "success",
      data: notifications
    })
  })
})

app.post('/notifications/tomorrow', (req, res) => {
  getCommonNotifications(client).then(notifications => {
    //+ dodać powiadomienia o poprawie ocen
    //+ dodać powiadomienia o stroju WF
    //+ dodać powiadomienia o śniadaniu
    //+ dodać powiadomienia o laptopie
    res.status(201).json({
      status: "success",
      data: notifications
    })
  })
})

app.post('/timetable/today', (req, res) => {
  const {
    monday,
    sunday
  } = weekOfDay(new Date())

  client.calendar.getTimetable(monday, sunday).then(data => {
    const table = data[((new Date()).getDay() + 6) % 7]
    //+ dodać powiadomienia dla każdej lekcji (sprawdziany, itp.)
    res.status(201).json({
      status: "success",
      data: table
    })
  })
})

app.post('/timetable/tomorrow', (req, res) => {
  const tomorrow = new Date()
  const day_number = (tomorrow.getDay() + 6) % 7

  if (day_number <= 3) { // monday - thursday
    tomorrow.setDate(tomorrow.getDate() + 1)
  }
  else { // friday, saturday, sunday
    tomorrow.setDate(tomorrow.getDate() + 7 - day_number)
  }

  const {
    monday, sunday
  } = weekOfDay(tomorrow)

  client.calendar.getTimetable(monday, sunday).then(data => {
    const table = data[(tomorrow.getDay() + 6) % 7]
    
    res.status(201).json({
      status: "success",
      data: Array.from(table, e => e.name ? e : 'Okienko')
    })
  })
})

app.post('/timetable/pack', (req, res) => {
  const tomorrow = new Date()
  const day_number = (tomorrow.getDay() + 6) % 7

  if (day_number <= 3) { // monday - thursday
    tomorrow.setDate(tomorrow.getDate() + 1)
  }
  else { // friday, saturday, sunday
    tomorrow.setDate(tomorrow.getDate() + 7 - day_number)
  }

  const {
    monday, sunday
  } = weekOfDay(tomorrow)

  client.calendar.getTimetable(monday, sunday).then(data => {
    const table = data[(tomorrow.getDay() + 6) % 7]
    data = Array.from(table, e => e.name ? e : null)

    res.status(201).json({
      status: "success",
      data: {
        count: data.length,
        classes: data.filter((e, i) => e && (data.indexOf(e) === i))
      }
    })
  })
})
