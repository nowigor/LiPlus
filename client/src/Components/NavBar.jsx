import "../Styles/NavBar.css";
import React from "react";
import {Link } from "react-router-dom";
import HomeIcon from "./Icons/HomeIcon";
import GradesIcon from "./Icons/GradesIcon";
import InfoIcon from "./Icons/InfoIcon";
import NewsIcon from "./Icons/NewsIcon";
import SettingsIcon from "./Icons/SettingsIcon";
const NavBar = () =>
{
  const handleClick = (e) =>
  { 
    console.log(e.target.src);
  }
    return(
      <section className="wrapper">
        <nav className="nav-wrapper" >
          <Link to="/" className="nav-link  item-2" ><span className="item"><HomeIcon /><span className="text-down">Główna</span></span></Link>
          <Link to='grades' className="nav-link "><span className="grades item"><GradesIcon/><span>Oceny <br/>Frekwencja </span></span></Link>
          <Link to="news" className="nav-link "><span className="news item"><NewsIcon/><span className="text-down2"></span>Wiadomości<br></br> Ogłoszenia</span></Link>
          <Link to="info" className="nav-link"> <span className="info item"><InfoIcon/><span>Informacje<br/> Powiadomienia</span></span></Link>
          <Link to="settings" className="nav-link item-1"><span className="settings item"><SettingsIcon/>Ustawienia</span></Link>
        </nav>
      </section>
    )
}
export default NavBar