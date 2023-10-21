import axios from "axios";
import React, {useEffect, useState, useRef} from 'react';
import MainScreen from "./MainScreen";
import "./Styles/style.css"

const serverPort = "3030";
const preURL = "http://localhost:" + serverPort;
// const preURL = "http://http://ip:" + serverPort;


const App = () => {
const [tmpData, setTmpData] = useState(false)
  const UserLogin = useRef(null);
  const UserPassword = useRef(null);
  const getData = () =>
  {
    fetch(preURL + "/")
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error=> console.log(error))
  }
  const LogIn = async () =>{
    try {
      const response = await axios.post(preURL + '/user/auth/login', {UserLogin: UserLogin.current.value, UserPassword: UserPassword.current.value});
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  const LogOut = async () =>{
    try {
      const response = await axios.post(preURL + '/user/auth/logut');
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  const getTimetable = async () =>{
    try {
      const response = await axios.post(preURL + '/api/timetable/today');
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
        <input type="text" ref={UserLogin}></input>
        <input type="password" ref={UserPassword}></input>
      <button onClick={LogIn}>Zaloguj</button>
      <button onClick={LogOut}>Wyloguj się</button>
      <button onClick={getTimetable}>Get timetable</button>
    </div>
  );
}

export default App;
