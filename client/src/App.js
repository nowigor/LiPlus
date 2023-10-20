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
  const SendUserData = async () =>{
    console.log(UserPassword.current.value)
    try {
      const response = await axios.post(preURL + '/user', {UserLogin: UserLogin.current.value, UserPassword: UserPassword.current.value});
      // console.log(response.data.data);
      setTmpData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }


  // getData()

  return (
    <div className="App">
        <input type="text" ref={UserLogin}></input>
        <input type="password" ref={UserPassword}></input>
      <button onClick={SendUserData}>Zaloguj</button>
      {/* <MainScreen></MainScreen> */}
      {console.log("TU", tmpData)}
      { tmpData &&
       tmpData.map((e)=>{
        return(
          <div>{e.name}</div>
        )
       })
      }
    </div>
  );
}

export default App;
