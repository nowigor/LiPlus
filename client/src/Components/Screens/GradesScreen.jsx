import React, { useState } from "react";
import { ScreenSwitch } from "./ScreenSwitch";
import { useNavigate } from "react-router-dom";
import { Grade } from "../Grade";
import "../../Styles/screen.css";

const GradesScreen = () =>{
    const [active, setActive] = useState("Oceny")
    const navigate = useNavigate()
    let enabled = true

    const onClick = {
        "Oceny": () => {},
        "Frekwencja": () => navigate("/attendance")
    }

    return (
        <section className="grades-attendance-flex-wrapper">
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick} />
            <Grade/> 
        </section>
    )
}
export default GradesScreen
