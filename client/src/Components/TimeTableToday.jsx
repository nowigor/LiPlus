import axios from "axios"
import React, { useEffect, useState } from 'react'
import consts from "../Constants/ServerConsts"
import "../Styles/TimeTableToday.css"

function isPast(hour, now = new Date()) {
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')

  return new Date(`1970-01-01T${h}:${m}`) > new Date(`1970-01-01T${hour.padStart(5, '0')}`)
}

export default function TimeTableToday() {
  const [timetable, setTimetable] = useState([
    {
      name: 'Matematyka',
      teacher: 'Lidia Skóra',
      room: '206',
      from: '8:00',
      to: '8:45',
      active: true,
      flag: '',
      old: {},
      notifications: []
    },
    {
      name: 'Informatyka',
      teacher: 'Kamil Kielecki',
      room: '302',
      from: '8:50',
      to: '9:35',
      active: true,
      flag: '',
      old: {},
      notifications: []
    },
    {
      name: 'Język Polski',
      teacher: 'Joanna Biela von SS-Mann in der Deutsche Armee',
      room: '105',
      from: '9:40',
      to: '10:25',
      active: true,
      flag: '',
      old: {},
      notifications: [
        {
          importance: 2,
          title: 'Sprawdzian',
          topic: 'Lalka, Bolesław Prus',
          icon: 'red_warning'
        },
        {
          importance: 1,
          title: 'Zadanie domowe xDDDDD',
          topic: 'Wypisz wszystkich bohaterów lalki',
          icon: 'yellow_test'
        }
      ]
    },
    {
      name: 'Okienko',
      teacher: null,
      room: null,
      from: '10:30',
      to: '11:15',
      active: true,
      flag: '',
      old: {},
      notifications: []
    },
    {
      name: 'Programowanie zaawansowanych aplikacji webowych',
      teacher: 'Mirosław Mościcki',
      room: '305',
      from: '11:30',
      to: '12:15',
      active: true,
      flag: '',
      old: {},
      notifications: []
    },
    {
      name: 'Motoryzacja',
      teacher: 'Igor Nowacki',
      room: '3',
      from: '12:25',
      to: '13:10',
      active: true,
      flag: '',
      old: {},
      notifications: [
        {
          importance: 2,
          title: 'Sprawdzian',
          topic: 'Zmiana biegów na włączonym sprzęgle',
          icon: 'red_warning'
        },
        {
          importance: 1,
          title: 'Sprawdzian',
          topic: 'Wyłączenie długich świateł',
          icon: 'yellow_test'
        },
        {
          importance: 1,
          title: 'Kartkówka',
          topic: 'Budowa samochodu',
          icon: 'yellow_test'
        }
      ]
    },
  ])

  const now = new Date('1970-01-01T10:43')

  const style = {
    info: e => {
      return {
        width: `${!e.notifications.length ? 100 : 40}%`
      }
    },
    circle: e => {
      return {
        border: `3px solid ${isPast(e.to, now) ? '#B1B6BA' : '#207CE7'}`,
        backgroundColor: `${isPast(e.from, now) && !isPast(e.to, now) ? '#207CE7' : 'transparent'}`
      }
    },
    dash: e => {
      return {
        backgroundColor: `${isPast(e.to, now) ? '#B1B6BA' : '#207CE7'}`
      }
    },
    text: e => {
      return {
        color: `${isPast(e.to, now) ? '#B1B6BA' : '#207CE7'}`
      }
    },
    main: e => {
      return {
        boxShadow: `${isPast(e.from, now) && !isPast(e.to, now) ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : ''}`,
        backgroundColor: `${isPast(e.from, now) && !isPast(e.to, now) ? 'rgba(150, 202, 250, 0.22)' : 'transparent'}`
      }
    },
    notif: e => {
      return {
        boxShadow: `${!isPast(e.to, now) ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : ''}`,
      }
    },
    notif_image: e => {
      return {
        filter: `saturate(${isPast(e.to, now) ? '0' : '1'})`
      }
    }
  }

  return (
    <div className="hm-tt-container">
      <img className="hm-house" src={require(`../Includes/icons/gray_house.png`)}></img>
      <div className="hm-dash"></div>
      {
        timetable.map(e => {
          return (
            <div className="hm-tt-lesson">
              <div className="hm-tt-timeline">
                <p className="hm-tt-hour">{e.from}<br></br>{e.to}</p>
                <div className="hm-tt-circle" style={style.circle(e)}></div>
                {Array.from({ length: 5 }, _ => (0)).map(_ => <div className="hm-tt-dash" style={style.dash(e)}></div>)}
              </div>
              <div className="hm-tt-main" style={style.main(e)}>
                <div className="hm-tt-info" style={style.info(e)}>
                  <p className="hm-tt-name" style={style.text(e)}>{e.name}</p>
                  <p className="hm-tt-teach" style={style.text(e)}>{e.teacher}</p>
                  <p className="hm-tt-room" style={style.text(e)}>{e.room ? `s. ${e.room}` : ''}</p>
                </div>
                <div className="hm-tt-notif-box">
                  {e.notifications.map(n => <div className="hm-tt-notif" style={style.notif(e)}>
                    <img className="hm-tt-n-img" style={style.notif_image(e)} src={require(`../Includes/icons/notifications/${n.icon}.png`)}></img>
                    <p className="hm-tt-n-title" style={style.text(e)}>{n.title}</p>
                    <p className="hm-tt-n-topic" style={style.text(e)}>{n.topic}</p>
                  </div>)}
                </div>
              </div>
            </div>
          )
        })
      }
      <img className="hm-house" src={require(`../Includes/icons/blue_house.png`)}></img>
    </div>
  )
}
