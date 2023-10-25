import "../Styles/NavBar.css";
import React, {useState, useRef, useEffect} from "react";
import {Link } from "react-router-dom";
import HomeIcon from "./Icons/HomeIcon";
import GradesIcon from "./Icons/GradesIcon";
import InfoIcon from "./Icons/InfoIcon";
import NewsIcon from "./Icons/NewsIcon";
import SettingsIcon from "./Icons/SettingsIcon";
const NavBar = () =>
{
 const object =  {home: "#747474", grades: "#747474", news: "#747474", info: "#747474", settings: "#747474"};
  const [color, setColor] = useState(object);

  useEffect(() => {
    HandelClick("home")
 }, []);
  const HandelClick = (key) =>
  {
    const copy = {...object};    
    copy[key] = "#00C520";
    setColor(copy);
  }
    return(
      <section className="wrapper">
        <nav className="nav-wrapper" >
          <Link to="/" className="nav-link  item-2" onClick={() => HandelClick("home")}>
            <span className="item"><HomeIcon color={color.home}/>
              <span className="text-down" style={{color: color.home}}>Główna</span>
            </span>
          </Link>
          <Link to='grades' className="nav-link "  onClick={() => HandelClick("grades")}>
            <span className="grades item"><GradesIcon color={color.grades}/>
              <span style={{color: color.grades}}>Oceny <br/>Frekwencja </span>
            </span>
          </Link>
          <Link to="news" className="nav-link " onClick={() => HandelClick("news")}>
            <span className="news item"><NewsIcon color={color.news}/>
              <span className="text-down2" style={{color: color.news}}>Wiadomości<br></br> Ogłoszenia</span>
            </span>
          </Link>
          <Link to="info" className="nav-link" onClick={() => HandelClick("info")}> 
            <span className="info item"><InfoIcon color={color.info}/>
              <span style={{color: color.info}}>Informacje<br/> Powiadomienia</span>
            </span>
          </Link>
          <Link to="settings" className="nav-link item-1" onClick={() => HandelClick("settings")}>
              <span className="settings item"><SettingsIcon color={color.settings} />
                <span style={{color: color.settings}}>Ustawienia</span>
              </span></Link>
        </nav>
      </section>
    )
}
export default NavBar