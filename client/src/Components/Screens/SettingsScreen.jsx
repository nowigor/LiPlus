import "../../Styles/screen.css"
import "../../Styles/SettingsScreen.css"
import consts from "../../Constants/DesignConsts";
import React from "react";
import SettingsSubjectIcon from "../Icons/SettingsSubjectIcon";

const SettingsScreen = () =>
{ const tmp_data = [
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
    { id: "16", name: "Programowanie zaawansowanych aplikacji weebowych", grades: ["3", '4', '3+', '4', '3+'], absence: 28, average: 3.47 },
    { id: "17", name: "Psychologia", grades: ["4", '4+', '4', '5', '4+'], absence: 32, average: 4.11 },
    { id: "18", name: "Filozofia", grades: ["3", '3+', '4', '3+', '3+'], absence: 19, average: 3.67 },
    { id: "19", name: "Socjologia", grades: ["4", '4+', '4', '5', '4+'], absence: 27, average: 4.09 },
    { id: "20", name: "Prawo", grades: ["2", '3', '2+', '3', '2+'], absence: 100, average: 2.75 },
];
    return(
        <>
        <section className="flex-wrapper">
            <section className="subjects-background">
                <h1 className="text-h1-settings">Na jakie przedmioty nosisz laptopa do szkoły?</h1>
                <div className="subjects-box">
                {
                    tmp_data.map((e,i)=>{
                    const backgroundColor = consts.pastelColors[e.id - 1];
                        return(
                            <section  key={e.id + e.name}>
                                <div className="single-item">
                                    <div className="filled-circle" style={{backgroundColor: backgroundColor}}></div>
                                    <div className="subject-text">{e.name}</div>
                                    <SettingsSubjectIcon onClick={() => console.log(e)}/>
                                </div>
                                <div className="single-subject-line"></div>
                            </section>
                        )
                    })
                }
                </div>
            </section>
        </section>
        </>
    )
}
export default SettingsScreen