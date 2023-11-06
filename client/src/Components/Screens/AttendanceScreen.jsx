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
        getNotifcationsToday();
    
      }, [])
      const [notifications, setNotifications] = useState([]);
      const getNotifcationsToday = async () => {
        try {
          const response = await axios.post(consts.preURL + '/');
          setNotifications(response.data.data);
        } catch (error) {
        }
      }

    return (
        <section className="grades-attendance-wrapper">
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick}/>
            <section className="grades-attendance-box-wrapper">
                <Counts/>
            </section>
        </section>
    )
}
export default AttendaceScreen;
