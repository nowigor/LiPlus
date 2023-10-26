import React, { useState } from "react";
import { ScreenSwitch } from "../ScreenSwitch";
import { redirect, useNavigate } from "react-router-dom";
import { Grade } from "../Grade";

export function Grades() {
    const [active, setActive] = useState("Oceny")
    const navigate = useNavigate()
    let enabled = true

    const onClick = {
        "Oceny": () => {},
        "Frekwencja": () => navigate("/attendance")
    }

    return (
        <div>
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick} />
            
            <Grade/> 
        </div>
    )
}
