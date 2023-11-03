import axios from "axios";
import React, { useEffect, useState } from 'react';
import consts from "../Constants/ServerConsts";
const TimeTableToday = () =>
{
    const [timeTable, setTimeTable] = useState([]);
        useEffect(() => {
        getTimeTabletoday();
      }, [])

      const getTimeTabletoday = async () => {
        try {
          const response = await axios.post(consts.preURL + '/timetable/today', { UserLogin: localStorage.getItem("UserLogin"), UserPassword: localStorage.getItem("UserPassword") });
          setTimeTable(response.data.data);
          console.log(response.data.data);
        } catch (error) {}
        }

    return(
        <>
            <h1>Hello</h1>
        </>
    )
}
export default TimeTableToday;