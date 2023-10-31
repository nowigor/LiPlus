import React from "react"
import "../Styles/Grade.css"
import { AttendanceIcon } from "./Icons/AttendanceIcon"

export function Grade({id, name, grades, absence, average}) {
    const pastelColors = [
        "#d882e7", "#d5a8c1", "#c3a8d9", "#98d4bb", "#c2de71", "#ffce7b", "#f5b041", "#c4c981", "#92a3b0", "#d1b37f",
        "#b994d2", "#78ddce", "#b6c46e", "#cca0d0", "#df92b1", "#c9d696", "#c4c394", "#fbb170", "#e8997d", "#ce7d74",
        "#c4aec2", "#d6e58a", "#ddc9a3", "#cf85d4", "#b2c57e", "#c7b2df", "#f0cda3", "#e0cdd5", "#fd8c7f", "#8cc0ca",
        "#98a4c0", "#d4cfa9", "#fbb0c7", "#c6dab3", "#f8d485", "#dfaec7", "#e5bb9b", "#bd9ed0", "#a1d5ae", "#f0a9aa",
        "#dcc2bb", "#dab28f", "#9dc3a5", "#b3c1a2", "#e2b6b2", "#8dc7b7", "#b3a9cc", "#e6c599", "#9cddab", "#d3b89a",
        "#e6db86", "#c8e1c0", "#b0c3c3", "#f0ad95", "#d2dbab", "#efb78e", "#b0a5c7", "#fbadcf", "#ffccab", "#d4c396",
        "#dfdd96", "#ffd89e", "#b9c6d1", "#dac6e2", "#f6d6ae", "#c5dcac", "#d5c2ce", "#dcb29b", "#ffbdc0", "#ffdf9a",
        "#c2b9e2", "#c0daa3", "#b4b5c9", "#ddb7cc", "#dfbca0", "#c7dcb7", "#a2c0e0", "#c2df9e", "#dfd2c1", "#b1d0bf",
        "#d6b4d4", "#c7d8a1", "#a7c9ca", "#a0c4e0", "#f8be9f", "#a2dac0", "#f3a0dd", "#f4b4bc", "#f6d5a0", "#b0d4d7",
        "#f2d9bb", "#eccdb7", "#dcc7e0", "#e2b5d7", "#c5d6bf", "#fec8bb", "#fcccb6", "#c7c7df", "#b5bdd7", "#fed19d"
      ];
    const backgroundColor = pastelColors[id - 1];
    let fontColor = "black";
    if (absence <= 50) {
        fontColor = "red";
    } else if (absence >= 51 && absence <= 80) {
        fontColor = "orange";
    } else {
        fontColor = "green";
    }
    return (
        <section class="grades-box" style={{ backgroundColor }}>
            <div class="grid-item-1">
                <div class="attendance"  style={{color: fontColor}}>
                    {absence}%
                </div>
            </div>
            <div class="grid-item-2">
                <div class="subject-name">{name}</div>
                <div class="grades-wp">
                    {grades.map(e =>{
                        return(
                            e + " "
                        )
                    })
                }
                </div>
            </div>
            <div class="grid-item-3">
                <div class="average">
                    {average } 
                </div>
            </div>
        </section>
    )
}
