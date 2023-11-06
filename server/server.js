const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");
const cheerio = require('cheerio');

const { getTimetable } = require('./Utils/getTimetable');
const { formatDay, weekOfDay } = require('./Utils/dateFormat')
const { getEvent } = require('./Utils/getEvent')
const { getCommonNotifications, getMiscNotifications, getLessonNotifications, getGradeNotifications } = require('./Utils/notifications')
const { _request } = require('./Utils/_request')

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
client.calendar.getEvent = (id, title) => getEvent(id, title, client)
client._request = (method, apiFunction, data, _) => _request(method, apiFunction, data, client)

//@ User authentication
const authenticate = (res, user) => {
  client.authorize(user.login, user.password).then(result => {
    if (result) {
      client.user = {
        login: user.login,
        password: user.password,
      }
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
  client.authorize(req.body.UserLogin, req.body.UserPassword).then(() => {
    return Promise.all([
      getCommonNotifications(client),
      getGradeNotifications(client)
    ]).then(([common, grade]) => {
      if (!grade) {
        res.status(401).json({
          status: "error",
          data: "Nie mogliśmy pobrać danych :("
        })
      }

      res.status(201).json({
        status: "success",
        data: common.concat(grade)
      })
    })
  }, () => {
    res.status(401).json({
      status: "error",
      data: "Nie mogliśmy pobrać danych :("
    })
  })
})

app.post('/notifications/tomorrow', (req, res) => {
  client.authorize(req.body.UserLogin, req.body.UserPassword).then(() => {
    return Promise.all([
      getCommonNotifications(client),
      getGradeNotifications(client),
      getMiscNotifications(client)
    ]).then(([common, grade, misc]) => {
      if (!grade) {
        res.status(401).json({
          status: "error",
          data: "Nie mogliśmy pobrać danych :("
        })
      }

      res.status(201).json({
        status: "success",
        data: common.concat(grade).concat(misc)
      })
    })
  }, () => {
    res.status(401).json({
      status: "error",
      data: "Nie mogliśmy pobrać danych :("
    })
  })
})

app.post('/timetable/today', (req, res) => {
  client.authorize(req.body.UserLogin, req.body.UserPassword).then(() => {
    const today = new Date()
    const {
      monday,
      sunday
    } = weekOfDay(today)

    return Promise.all([
      client.calendar.getTimetable(monday, sunday),
      getLessonNotifications(formatDay(today), client)
    ]).then(([timetable, notifications]) => {
      if (!timetable) {
        res.status(401).json({
          status: "error",
          data: "Nie mogliśmy pobrać danych :("
        })
      }

      const table = timetable[(today.getDay() + 6) % 7]
      for (let i = 0; i < table.length; i++) {
        if (table[i]) {
          table[i].notifications = notifications[i]
        }
      }
      res.status(201).json({
        status: "success",
        data: table
      })
    })
  }, () => {
    res.status(401).json({
      status: "error",
      data: "Nie mogliśmy pobrać danych :("
    })
  })
})

app.post('/timetable/tomorrow', (req, res) => {
  client.authorize(req.body.UserLogin, req.body.UserPassword).then(() => {
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
      if (!data) {
        res.status(401).json({
          status: "error",
          data: "Nie mogliśmy pobrać danych :("
        })
      }

      const table = data[(tomorrow.getDay() + 6) % 7]

      res.status(201).json({
        status: "success",
        data: {
          start: table.find(e => e).from,
          end: table.reverse().find(e => e).to,
          table
        }
      })
    })
  }, () => {
    res.status(401).json({
      status: "error",
      data: "Nie mogliśmy pobrać danych :("
    })
  })
})

app.post('/timetable/pack', (req, res) => {
  client.authorize(req.body.UserLogin, req.body.UserPassword).then(() => {
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
      if (!data) {
        res.status(401).json({
          status: "error",
          data: "Nie mogliśmy pobrać danych :("
        })
      }

      const table = data[(tomorrow.getDay() + 6) % 7].filter(e => e)

      res.status(201).json({
        status: "success",
        data: {
          count: table.length,
          classes: table.filter(e => e.name !== 'Okienko').map(e => e.name).filter((e, i, a) => a.indexOf(e) === i)
        }
      })
    })
  }, () => {
    res.status(401).json({
      status: "error",
      data: "Nie mogliśmy pobrać danych :("
    })
  })
})

app.post('/api/attendance', (req, res) => {
  const {
    startDate,
    endDate
  } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  handleAttendance(start,end).then((data)=>{
    res.status(200).json(data);
  })
})




//!!!!!!!!!!!!!!!!!!!!!!!!handle functions!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const countAbsence = async() => {
  const data = await client.absence.getAbsences();
  const now = new Date();
  const month = now.getMonth();

  let tab = [];

  let counters = [
    {type: "nb", count: 0}, 
    {type: "u", count: 0}, 
    {type: "sp", count: 0}
  ];  
  data["0"].forEach(element => {
    if(element.date != null)
    {
      element.table.forEach(element1 => {
        if(element1 != null)
        {
          counters.forEach((counter)=>{
            if(counter.type == element1.type)
            {
              counter.count++;
            }
          })
        }
        
      });
    };
  });
  return counters;
}
// const DaysThisMonth = () => {
//   const date = new Date();

//   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//   let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//   for(let day = firstDay; true; day.setDate(day.getDate() - 1))
//   {
//     //poniedzialek
//     if(day.getDay() == 1)
//     {
//       firstDay = day;
//       break;
//     }
//   }

//   for(let day = lastDay; true; day.setDate(day.getDate() + 1))
//   {
//     //niedziela
//     if(day.getDay() == 0)
//     {
//       lastDay = day;
//       break;
//     }
//   }

//   let result = []
//   for(let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1))
//   {
//     let element = {day:day.getDate(),date:day};
//     result.push(element);
//   }
//   return result;
// }

const handleAttendance = async (dateStart,dateEnd) => {
  const counters = await countAbsence();
  const absences = await absence(dateStart,dateEnd);
  return {counters, absences};
}


const absence = async (dateStart,dateEnd) => {
  console.log(dateStart);
  console.log(dateEnd);

  const data = await client.absence.getAbsences();

  tabIds = []
  data["0"].forEach(element => {
    if(element.date != null)
    {
      element.table.forEach(element1 => {
        if(element1 != null)
        {
          tabIds.push(element1.id);
        }
        
      });
    };
  });
  let result = []
  for(let i = 0; i < tabIds.length; i++)
  {
    const row = await client.absence.getAbsence(tabIds[i]);
    const day = new Date(row.date.slice(0,10));
    if (day >= dateStart && day <= dateEnd) {
      result.push(row);
    }
  }

  return result;
};
//!!!!!!!!!!!!!!!!!!!!!!!!handle functions!!!!!!!!!!!!!!!!!!!!!!!!!!!!