import axios from "axios";
import React, {useEffect, useState, useRef} from 'react';
import Login from "./Components/Screens/Login";
import consts from "./Includes/consts";
import "./Styles/style.css"

const App = () => {

  const [authorize, SetAuthorize] = useState(false);
  useEffect(() => {
    console.log("=====")
    console.log(localStorage)
   }, []);

  const getTimetable = async () =>{
    try {
      const response = await axios.post(consts.preURL + '/api/timetable/today');
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  const handleAuthorize = (status) =>{
    if(status) SetAuthorize(status);
  }

  return (
    <div className="App">
      <Login authorized={(status)=> handleAuthorize(status)}/>
      {authorize &&
      <button onClick={getTimetable}>GetTime table</button>
      }
    </div>
  );
}

export default App;
