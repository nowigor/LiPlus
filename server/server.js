const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");
const cheerio = require('cheerio');

const {getTimetable} = require('./Utils/getTimetable');

const app = express();
app.use(cors());
const client = new Librus();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

//@ +++++++ SERVER INFO ++++++++
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//@ +++++++ END SERVER INFO ++++++++



//? ======= ROUTES ========
app.post('/user/auth/login', (req, res) =>
{
  const {UserLogin, UserPassword} = req.body;
  UserAuth(res,UserLogin, UserPassword);
  
});
app.post('/user/auth/logut', (req, res) =>
{
  //! TODO
  // Zrobić sposób na wylogowanie bo taki nie działa 
  UserAuth(res, "fake", "fake");
});

app.post('/api/timetable/today', (req,res)=>{
  getTimetable("2023-09-25", "2023-10-01", client)
  .then((data) => {
  return res.status(201).json({ status: "success", data: data });
  })
})

app.get('/', (req,res)=>{
  return res.status(200).json({content: "content"});
})

app.post('/api/grades', (req, res) => {
  handleApiGrades().then((data) => {
      res.status(200).json(data);
  });
});

//? ======= END ROUTES ========



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
//? ======= END Handle for routes =======


//@ HELPFULL FUNCTIONS
const DateToday = () =>
{
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Miesiące są zero-based
  const day = today.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate
}
//@ END HELPFULL FUNCTIONS

