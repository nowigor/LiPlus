import React, { useEffect, useState } from "react";
import axios from "axios";
import consts from "../../Constants/ServerConsts";
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
    
    useEffect(() => {
        getData();
        console.log({tmp_data})
        console.log(localStorage)
        
    }, [])
    const [tmp_data, setTmp_data] = useState([]);
      const getData = async () => {
        try {
          const response = await axios.post(consts.preURL + '/api/grades');
          console.log(response.data)
          setTmp_data(response.data)
        } catch (error) {
        }
      }

    return (
        <section className="grades-attendance-wrapper">
            <ScreenSwitch options={["Oceny", "Frekwencja"]} active={active} setActive={setActive} onClick={onClick} />
            <section className="grades-attendance-box-wrapper">
                {
                    tmp_data.map((e,i )=>
                    {
                        return(
                            <Grade id={e.id} name={e.name} grades = {e.grades} absence={e.attendance} average={e.average} key={e.name + i}/>
                        )
                    })
                }
            </section>
        </section>
    )
}
export default GradesScreen
