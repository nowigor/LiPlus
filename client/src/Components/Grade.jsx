import React from "react"
import "../Styles/Grade.css"
import { AttendanceIcon } from "./Icons/AttendanceIcon"

export function Grade({data, id, name, grades, absence, average}) {

    console.log(data)
    return (
        <section className="grade-background">
            <div className="attendance-background">
                <span className="att-number">{absence}%</span>
                <div className="line"> </div>
                <AttendanceIcon fillColor={"#3DC753"}/>
            </div>
            <div className="middle-background">
                <p className="subject">{name}</p>
                <div className="grades-background">
                    {
                        grades.map((e,i) => <p className="grade" key={i + "grade"}>
                            {e}
                        </p>)
                    }
                </div>
            </div>
            <div className="average-background">
                <p>{average.toFixed(2)}</p>
            </div>
        </section>
    )
}
