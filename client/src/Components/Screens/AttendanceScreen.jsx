import React, { useState } from "react";
import { ScreenSwitch } from "./ScreenSwitch";
import { useNavigate } from "react-router-dom";
import "../../Styles/screen.css";

const AttendaceScreen = () => {
    const [active, setActive] = useState("Frekwencja")
    const navigate = useNavigate()
    let enabled = true

    const onClick = {
        "Oceny": () => navigate("/grades"),
        "Frekwencja": () => {}
    }

    return (
        <section className="grades-attendance-wrapper">
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick}/>
        </section>
    )
}
export default AttendaceScreen;
