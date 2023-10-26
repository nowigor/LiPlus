import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Screens/Login";
import NavBar from "./Components/NavBar";
import HomeScreen from "./Components/Screens/HomeScreen";

import GradesScreen from './Components/Screens/GradesScreen';
import NewsScreen from './Components/Screens/NewsScreen';
import SettingsScreen from './Components/Screens/SettingsScreen';
import InfoScreen from './Components/Screens/InfoScreen';

import "./index.css"
import { GradesAttendance } from "./Components/Screens/GradesAttendance";

const App = () => {
  const [authorize, SetAuthorize] = useState(false);

  return (
    <>
    {authorize === false ? (
      <Login authorized={(status)=> {if(status)SetAuthorize(status)}}/>
    ): null}
      {authorize &&
          <BrowserRouter>
            <Routes className="cos">
              <Route path="login" element={<Login/>}></Route>
              <Route path="/" element={<HomeScreen/>}> </Route>
              <Route path="grades" element={<GradesScreen/>}> </Route>
              <Route path="info" element={<InfoScreen/>}> </Route>
              <Route path="news" element={<NewsScreen/>}> </Route>
              <Route path="settings" element={<SettingsScreen/>}> </Route>
            </Routes>
          <NavBar/>
          </BrowserRouter>
      }
    </>
  );
}

export default App;
