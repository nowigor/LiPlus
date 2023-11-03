import axios from "axios";
import React, { useEffect, useState } from 'react';
import LoadingScreen from "./LoadingScreen";
import consts from "../../Constants/ServerConsts";
import SingleNotification from "../SingleNotification";
import '../../Styles/HomeScreen.css';
import getPolishTodayDate from "../../Constants/getPolishTodayDate";
import TimeTableToday from "../TimeTableToday";
const HomeScreen = () => {
  useEffect(() => {
    getNotifcationsToday();

  }, [])
  const [notifications, setNotifications] = useState([]);
  const getNotifcationsToday = async () => {
    try {
      const response = await axios.post(consts.preURL + '/notifications/today', { UserLogin: localStorage.getItem("UserLogin"), UserPassword: localStorage.getItem("UserPassword") });
      setNotifications(response.data.data);
    } catch (error) {
    }
  }
  return (
    <section className="flex-wrapper">
      <h1>{getPolishTodayDate().toString()}</h1>
        <section className="notifications-wrapper">
            {notifications.length <= 0 ?
            <div className="r"><LoadingScreen/></div>
          :
            notifications.map((e, i) => {
              return (
                <SingleNotification element={e} index={i} key={i + e.subject} />
              )
            })
          }
        </section>
        <section className="timetable-wrapper shadow">
          <TimeTableToday/>
        </section>
    </section>
  )
}
export default HomeScreen