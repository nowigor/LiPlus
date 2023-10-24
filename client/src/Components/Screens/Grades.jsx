import React, { useState } from "react";
import { ScreenSwitch } from "../ScreenSwitch";
import { redirect } from "react-router-dom";
import { Grade } from "../Grade";

export function Grades() {
    const [active, setActive] = useState("Oceny")

    const onClick = {
        "Oceny": () => { console.log("zostajemy ocenki") },
        "Frekwencja": () => { console.log("zmieniamy na frekwencje") }
    }

    // adding <Grade/> makes it not compile
    return (
        <div>
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick} />
            
            <Grade/> 
        </div>
    )
}
