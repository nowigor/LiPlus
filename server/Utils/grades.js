const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");
const cheerio = require('cheerio');

const { getTimetable } = require('../Utils/getTimetable');
const { formatDay, weekOfDay } = require('../Utils/dateFormat')
const { getEvent } = require('../Utils/getEvent')
const { getCommonNotifications, getMiscNotifications, getLessonNotifications, getGradeNotifications } = require('../Utils/notifications')
const { _request } = require('../Utils/_request')

const client = new Librus();
client.calendar.getTimetable = (start, end) => getTimetable(start, end, client)
client.calendar.getEvent = (id, title) => getEvent(id, title, client)
client._request = (method, apiFunction, data, _) => _request(method, apiFunction, data, client.caller)

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
      // console.log(startWeek.getTime() + " -- " + endWeek.getTime())
      // console.log(today.getTime())
      // //jezeli jest w tym tyogdniu today
      // if ((today.getTime() >= startWeek.getTime() && today.getTime() <= endWeek.getTime()) || today.toDateString() == endWeek.toDateString() || today.toDateString() == startWeek.toDateString()) {
      //   console.log(startWeek.toDateString() + " -- " + endWeek.toDateString())
      //   console.log(today)
      // }
      if ((today >= startWeek && today <= endWeek)|| today.toDateString() == endWeek.toDateString() || today.toDateString() == startWeek.toDateString()) {
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
    const percent = await countAbsenceSubject();
  
    const tab = [];
  
    let counter = 0;
    for (const subject of subjects) {
      counter += 1;
      let element = { id: counter, id_subject: subject.id, name: subject.name };
      const grades = await getGrades(subject.id);
      element.grades = grades;
      if(grades)
      {
        if(avg(grades))
        {
          element.avg = avg(grades).toFixed(2);
        }
        else
        {
          element.avg = avg(grades);
        }
      }
      else
      {
        element.average = null;
      }
      element.attendance = percent[subject.name]
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
  
  const countAbsenceSubject = async () => {
    let subjects = await countSubjects();
    const absences = await client.absence.getAbsences();
    const now = new Date();
    let tab = [];
    
    absences["0"].forEach(element => {
      if(element.date != null)
      {
        element.table.forEach(element1 => {
          if(element1 != null)
          {
            tab.push(element1.id);
            // const absence = await client.absence.getAbsence(element.id);
          }
          
        });
      };
    });
    let tabAbsence = {}
    for(let i = 0; i < tab.length; i++)
    {
      
      const absence = await client.absence.getAbsence(tab[i]);
      const count = subjects[absence.subject];
      if(absence.type == "nieobecność uspr." || absence.type == "nieobecność" )
      {
        if(absence.subject in tabAbsence)
        {
          tabAbsence[absence.subject]++;
        }
        else
        {
          tabAbsence[absence.subject] = 1;
        }
      }
    }
  
  
    for (const subject in subjects) {
      if(subject in tabAbsence)
      {
        subjects[subject] = Math.round(((subjects[subject] - tabAbsence[subject])/subjects[subject]) * 100);
      }
      else
      {
        subjects[subject] = 100;
      }
    }
  
    return subjects
  }

  module.exports = handleApiGrades;