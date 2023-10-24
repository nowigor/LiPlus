import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Screens/Login";
import NavBar from "./Components/NavBar";
import HomeScreen from "./Components/Screens/HomeScreen";

import GradesScreen from './Components/Screens/GradesHome';
import NewsScreen from './Components/Screens/NewsScreen';
import SettingsScreen from './Components/Screens/SettingsHome';
import InfoScreen from './Components/Screens/InfoHome';

import "./index.css"

const App = () => {
   const dasd = [<promise></promise>]
  const [authorize, SetAuthorize] = useState(false);
  useEffect(() => {
   }, []);

  
  const handleAuthorize = (status) =>{
    if(status) SetAuthorize(status);
  }

  return (
    <>
      <Login authorized={(status)=> handleAuthorize(status)}/>
      {authorize &&
          <BrowserRouter>
            <Routes className="cos">
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
