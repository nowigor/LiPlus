import React, { useState } from "react";
import { ScreenSwitch } from "../ScreenSwitch";

export function Attendace() {
    const [active, setActive] = useState("Frekwencja")

    const onClick = {
        "Oceny": () => { console.log("zmieniamy na ocenki") },
        "Frekwencja": () => { console.log("zostajemy frekwencja") }
    }

    return (
        <div>
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick}/>
        </div>
    )
}
