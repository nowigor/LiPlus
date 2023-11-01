import React, { useState } from "react";
import { ScreenSwitch } from "./ScreenSwitch";
import { useNavigate } from "react-router-dom";
import { Grade } from "../Grade";
import "../../Styles/screen.css";

const GradesScreen = () =>{
    const [active, setActive] = useState("Oceny")
    const navigate = useNavigate()
    let enabled = true

    const tmp_data = [
        { id: "1", name: "Język Polski", grades: ["1", '2', '5+', '2+', '1'], absence: 80, average: 4.45 },
        { id: "2", name: "Matematyka", grades: ["3", '4', '4+', '5', '3+'], absence: 30, average: 3.82 },
        { id: "3", name: "Język Angielski", grades: ["4", '4', '4+', '5+', '4+'], absence: 100, average: 4.15 },
        { id: "4", name: "Fizyka", grades: ["3", '4', '3+', '4+', '3+'], absence: 57, average: 3.67 },
        { id: "5", name: "Chemia", grades: ["2", '3', '4', '3+', '2+'], absence: 95, average: 2.89 },
        { id: "6", name: "Historia", grades: ["5", '5', '4+', '5+', '5+'], absence: 5, average: 4.95 },
        { id: "7", name: "Biologia", grades: ["3", '4', '3+', '4', '3+'], absence: 26, average: 3.33 },
        { id: "8", name: "Geografia", grades: ["4", '5', '4+', '5', '4+'], absence: 35, average: 4.18 },
        { id: "9", name: "Informatyka", grades: ["2", '3', '2+', '3', '2+'], absence: 45, average: 2.55 },
        { id: "10", name: "Sztuka", grades: ["4", '5', '4+', '5+', '4+'], absence: 30, average: 4.12 },
        { id: "11", name: "Wychowanie Fizyczne", grades: ["3", '3+', '4', '3+', '3+'], absence: 12, average: 3.75 },
        { id: "12", name: "Muzyka", grades: ["5", '5+', '5', '5+', '5+'], absence: 82, average: 4.95 },
        { id: "13", name: "Etyka", grades: ["4", '4+', '4', '5', '4+'], absence: 22, average: 4.02 },
        { id: "14", name: "Technika", grades: ["2", '3', '2+', '3', '2+'], absence: 18, average: 2.98 },
        { id: "15", name: "Religia", grades: ["5", '5+', '5', '5+', '5+'], absence: 7, average: 5.00 },
        { id: "16", name: "Wiedza o Społeczeństwie", grades: ["3", '4', '3+', '4', '3+'], absence: 28, average: 3.47 },
        { id: "17", name: "Psychologia", grades: ["4", '4+', '4', '5', '4+'], absence: 32, average: 4.11 },
        { id: "18", name: "Filozofia", grades: ["3", '3+', '4', '3+', '3+'], absence: 19, average: 3.67 },
        { id: "19", name: "Socjologia", grades: ["4", '4+', '4', '5', '4+'], absence: 27, average: 4.09 },
        { id: "20", name: "Prawo", grades: ["2", '3', '2+', '3', '2+'], absence: 100, average: 2.75 },
    ];

    const onClick = {
        "Oceny": () => {},
        "Frekwencja": () => navigate("/attendance")
    }

    return (
        <section className="grades-attendance-wrapper">
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick} />
            <section className="grades-attendance-box-wrapper">
                {
                    tmp_data.map((e,i )=>
                    {
                        return(
                            <Grade id={e.id} name={e.name} grades = {e.grades} absence={e.absence} average={e.average} key={e.name + i}/>
                        )
                    })
                }
            </section>
        </section>
    )
}
export default GradesScreen
