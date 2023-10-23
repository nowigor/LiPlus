import axios from "axios";
import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Screens/Login";
import HomeScreen from "./Components/Screens/HomeScreen";
import NavBar from "./Components/NavBar";
import "./index.css"

const App = () => {

  const [authorize, SetAuthorize] = useState(false);
  useEffect(() => {
    console.log("=====")
    console.log(localStorage)
   }, []);

  
  const handleAuthorize = (status) =>{
    if(status) SetAuthorize(status);
  }

  return (
    <>
      <Login authorized={(status)=> handleAuthorize(status)}/>
      {authorize &&
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen/>}>
              </Route>
            </Routes>
          <NavBar/>
          </BrowserRouter>
      }
    </>
  );
}

export default App;
