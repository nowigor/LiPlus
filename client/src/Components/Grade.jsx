import React from "react"
import "../Styles/Grade.css"
import { AttendanceIcon } from "./Icons/AttendanceIcon"

export function Grade({ subject, attendance, grades }) {
    subject = "Projektowanie zaawansowanych aplikacji webowych"
    // subject = "Matematyka"
    attendance = 69
    grades = ["5", "2", "3+", "6", "4-", "5-", "1"]

    let sum = 0;
    grades.map(grade => {
        grade = grade.replace("+", ".5")
        
        if (grade.indexOf("-") !== -1) {
            grade = (parseInt(grade[0] - 1).toString() + ".75")
        }

        sum += parseFloat(grade)
        return grade;
    })
    const average = sum / grades.length 

    return (
        <section className="grade-background">
            <div className="attendance-background">
                <span className="att-number">{attendance}%</span>
                <div className="line"> </div>
                <AttendanceIcon fillColor={"#3DC753"}/>
            </div>
            <div className="middle-background">
                <p className="subject">{subject}</p>
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
