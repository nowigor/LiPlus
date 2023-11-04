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
client._request = (method, apiFunction, data, _) => _request(method, apiFunction, data, client.caller)


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
 client.authorize(req.UserLogin, req.UserPassword).then(()=>{
  return Promise.all([
    getCommonNotifications(client),
    getGradeNotifications(client)
  ]).then(([common, grade]) => {
    res.status(201).json({
      status: "success",
      data: common.concat(grade)
    })
  })
 })
})

app.post('/notifications/tomorrow', (req, res) => {
  return Promise.all([
    getCommonNotifications(client),
    getGradeNotifications(client),
    getMiscNotifications(client)
  ]).then(([common, grade, misc]) => {
    res.status(201).json({
      status: "success",
      data: common.concat(grade).concat(misc)
    })
  })
})

app.post('/timetable/today', (req, res) => {
  client.authorize(req.UserLogin, req.UserPassword).then(()=>{
    const today = new Date()
    const {
      monday,
      sunday
    } = weekOfDay(today)
  
    return Promise.all([
      client.calendar.getTimetable(monday, sunday),
      getLessonNotifications(formatDay(today), client)
    ]).then(([timetable, notifications]) => {
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
      start: table.find(e => e).from,
      end: table.reverse().find(e => e).to,
      data: table
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
    const table = data[(tomorrow.getDay() + 6) % 7].filter(e => e)

    res.status(201).json({
      status: "success",
      data: {
        count: table.length,
        classes: table.filter(e => e.name !== 'Okienko').map(e => e.name).filter((e, i, a) => a.indexOf(e) === i)
      }
    })
  })
})

app.post('/api/grades', (req, res) => {
  handleApiGrades().then((data) => {
      res.status(200).json(data);
  });
});

app.post('/test', (req, res) => {
  // client.calendar.getTimetable("2023-10-23", "2023-10-29").then((data) => {
  //   res.status(200).json(data);
  // });
  countSubjects().then((data) => {
    res.status(200).json(data);
  });
});





//? ======= Handle for routes =======
const UserAuth = (res,UserLogin, UserPassword) =>
{
 client.authorize(UserLogin, UserPassword)
  .then(result =>{
    if(result !== undefined)
    {
      //zalogowano pomyslnie
        return res.status(201).json({ status: "sucess", data: "Zalogowano" });
    }
    else
    {
      //nie zalogowano
      return res.status(401).json({ status: "error", data: "Nieudane logowanie" });
    }
  })
}

const getSubject = async (id) => {
  const data = await client.homework.listSubjects();
  const subject = data.find(element => element.id === id);
  return subject;
};

const getGrades = async (id) => {
    const subject = await getSubject(id);
    const data = await client.info.getGrades();

    for (const element of data) {
      if (element.name === subject.name) {
        const grades = element.semester[0].grades;
        //konwersja z string na int
        let result = [];
        grades.forEach((element)=>{
          result.push(element.value)
        })
        return result;
      }
    }
};

const avg = (tab) => {
  let sum = 0;
  let counter = 0;
  tab.forEach(element => {
    if(parseInt(element[0]))
    {
      sum += parseInt(element);
      counter++;
    }
    else if(parseInt(element[0]) && (element[1] == "-" || element[1] == "+"))
    {
      sum += parseInt(element[0]);
      counter++;
    }
  });
  if(counter == 0)
  {
    return null;
  }
  return sum/counter;
}

const startYearRounded = () => {
  const today = new Date();
  const sep = 8;
  let startYear;
  if(today.getMonth() >= sep)
  {
    startYear = new Date(today.getFullYear(), 8, 1)
  }
  else
  {
    startYear = new Date(today.getFullYear() - 1, 8, 1)
  }
  while(startYear.getDay() != 1)
  {
    startYear.setDate(startYear.getDate() - 1);
  }
  return startYear;
}

const countSubjects = async () => {
  const startYear = startYearRounded();
  const endYear = new Date(startYear.getFullYear() + 1,5, 30);
  const today = new Date();
  let startWeek = startYear;
  let endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 6);
  let subjects = {};

  while(true)
  {
    //jezeli jest koniec roku
    //czyli endWeek jest pozniej niz endYear
    if(endWeek > endYear)
    {
      console.log("koniec roku")
      break;
    }
    //jezeli jest w tym tyogdniu today
    if (today >= startWeek && today <= endWeek) {
      console.log("Ostatni tydzień");
      try{
        const timetable = await client.calendar.getTimetable(formatDateTimetable(startWeek), formatDateTimetable(endWeek));
        let counter = 0;

        while(true){
          console.log(today.toDateString());
          console.log(startWeek.toDateString());
          if(today.toDateString() == startWeek.toDateString())
          {
            break;
          }
          day = timetable[counter];
          day.forEach((lesson)=>{
            //czy jest lekcja o tej godzinie
            if(lesson != null)
            {
              //czy sie odbyla
              if(lesson.active)
              {
                if(lesson.name in subjects)
                {
                  subjects[lesson.name]++;
                }
                else
                {
                  subjects[lesson.name] = 1;
                }
              }
            }
          })

          //przesuwanie
          counter++
          startWeek.setDate(startWeek.getDate() + 1);
        }
      }
      catch(error){
        console.log(error);
      }
      break;
    }
    try{
      const timetable = await client.calendar.getTimetable(formatDateTimetable(startWeek), formatDateTimetable(endWeek));
      timetable.forEach((day) => {
        day.forEach((lesson)=>{
          //czy jest lekcja o tej godzinie
          if(lesson != null)
          {
            //czy sie odbyla
            if(lesson.active)
            {
              if(lesson.name in subjects)
              {
                subjects[lesson.name]++;
              }
              else
              {
                subjects[lesson.name] = 1;
              }
            }
          }
        })
      })
    }
    catch(error){
    }


    //console.log(formatDateTimetable(startWeek)+ "  " + formatDateTimetable(endWeek))
    //dodawanie tygodnia
    startWeek.setDate(startWeek.getDate() + 7);
    endWeek.setDate(endWeek.getDate() + 7);
  }
  return subjects;
}

const handleApiGrades = async () => {
  const subjects = await client.homework.listSubjects();
  const tab = [];

  let counter = 0;
  for (const subject of subjects) {
    counter += 1;
    let element = { id: counter, id_subject: subject.id, name: subject.name };
    const grades = await getGrades(subject.id);
    element.grades = grades;
    if(grades)
    {
      element.avg = avg(grades);
    }
    else
    {
      element.avg = null;
    }
    element.attendance = 47;
    tab.push(element);
  }
  //console.log(tab);
  return tab;
};

const formatDateTimetable = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
//? ======= END Handle for routes =======