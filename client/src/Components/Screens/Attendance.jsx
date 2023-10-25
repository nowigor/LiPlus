import React, { useState } from "react";
import { ScreenSwitch } from "../ScreenSwitch";
import { useNavigate } from "react-router-dom";

export function Attendace() {
    const [active, setActive] = useState("Frekwencja")
    const navigate = useNavigate()
    let enabled = true

    const onClick = {
        "Oceny": () => navigate("/grades"),
        "Frekwencja": () => {}
    }

    return (
        <div>
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick}/>
        </div>
    )
}
