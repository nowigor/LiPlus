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
  getTimetable("2023-10-23", "2023-10-23", client)
  .then((data) => {
  return res.status(201).json({ status: "success", data: data });
  })
})


app.get('/', (req,res)=>{
  return res.status(200).json({content: "content"});
})



//wszystkie przedmioty
app.post('/api/subjects/all', (req,res) => {
  allSubjects(res);
})

app.post('/api/subject/:id', (req, res) => {
  const subjectId = req.params.id;
  singleSubject(subjectId, res);
});

app.post('/api/subject/grades/:id', (req, res) => {
  const subjectId = req.params.id;
  gradesSubjets(subjectId, res);
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


const allSubjects = (res) => {
 
  client.homework.listSubjects().then((data) => {
    return res.status(200).json(data);
  });
}

const singleSubject = (id,res) => {

  client.homework.listSubjects().then((data) => {
    data.forEach((element) => {
      if(element.id == id)
      {
        return res.status(200).json(element);
      }
    });
    return res.status(404).json({status: "error", data: "nie ma takiego przedmiotu lub niezalogowano"});
  });
}


//Funckja zwracania ocen z przedmiotu

//jest problem
//lista ocen nie zwraca id przedmiotow
//na razie rozwiaznie tymczasowe porownywanie nazw przedmiotow
//potem mozna zwracac z id
const gradesSubjets = async (id, res) => {
  const subjects = await client.homework.listSubjects();
  let name;
  subjects.forEach((element) => {
    if(element.id == id)
    {
      name = element.name;
    }
  });
  const grades = await client.info.getGrades();
  grades.forEach((element) => {
    if(element.name == name)
    {
      const subject_grades = element.semester[0].grades;
      return res.status(200).json(subject_grades);
    }
  });
}
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

