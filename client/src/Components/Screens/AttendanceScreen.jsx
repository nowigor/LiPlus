import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ScreenSwitch } from "./ScreenSwitch";
import { useNavigate } from "react-router-dom";
import consts from "../../Constants/ServerConsts";
import Counts from "../Counts";
import "../../Styles/screen.css";

const AttendaceScreen = () => {
    const [active, setActive] = useState("Frekwencja")
    const navigate = useNavigate()
    let enabled = true

    const onClick = {
        "Oceny": () => navigate("/grades"),
        "Frekwencja": () => {}
    }

    useEffect(() => {
        getNotifcationsToday()
      }, [])
      const [counters, setCounters] = useState([]);
      const getNotifcationsToday = async () => {
        try {
          const apiUrl = 'http://localhost:3030/api/attendance';

          const requestBody = {
            startDate: '2023-09-01',
            endDate: '2023-11-05',
          };

        const response = await axios.post(apiUrl, requestBody);

        setCounters(response.data.counters);
        console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }

    return (
        <section className="grades-attendance-wrapper">
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick}/>
            <section className="grades-attendance-box-wrapper">
              {counters !== null && 
                <Counts counters={counters}/>
                
              }
            </section>
        </section>
    )
}
export default AttendaceScreen;
