const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");
const cheerio = require('cheerio');

const { getTimetable } = require('./Utils/getTimetable');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const client = new Librus();
client.calendar.getTimetable = (start, end) => getTimetable(start, end, client)


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
  //! TODO
  // Zrobić sposób na wylogowanie bo taki nie działa 
  authenticate(res, {
    login: null,
    password: null
  })
});



app.post('/notifications/today', (req, res) => {

})

app.post('/notifications/tomorrow', (req, res) => {

})

app.post('/timetable/today', (req, res) => {

})

app.post('/timetable/tomorrow', (req, res) => {

})

app.post('/timetable/pack', (req, res) => {

})
