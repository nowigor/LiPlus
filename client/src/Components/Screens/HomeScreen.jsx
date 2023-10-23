import axios from "axios";
import React, {useEffect, useState} from 'react';
import consts from "../../Includes/consts";
import '../../Styles/HomeScreen.css';
const HomeScreen = () =>
{
    const getTimetable = async () =>{
        try {
          const response = await axios.post(consts.preURL + '/api/timetable/today');
          console.log(response.data.data);
        } catch (error) {
          console.error(error);
        }
      }
    return(
        <section className="flex-wrapper">
            <span>LiPlus</span>
            <button onClick={getTimetable}>GetTime table</button>
        </section>
    )
}
export default HomeScreen