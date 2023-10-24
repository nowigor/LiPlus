import "../Styles/NavBar.css";
import React from "react";
import {Link } from "react-router-dom";
import home from "../Includes/icons/navigation/home.svg"
import grades_att from "../Includes/icons/navigation/grades_att.svg"
import info from "../Includes/icons/navigation/info.svg"
import news from "../Includes/icons/navigation/news.svg"
import settings from "../Includes/icons/navigation/settings.svg"
const NavBar = () =>
{
    return(
      <section className="wrapper">
        <nav className="nav-wrapper">
          <Link to="/" className="nav-link  item-2"><span className="item"><img src={home} alt="home-icon" className="icon"></img><span className="text-down">Główna</span></span></Link>
          <Link to='grades' className="nav-link "><span className="grades item"><img src={grades_att} alt="home-gardes"  className="icon"></img>Oceny </span></Link>
          <Link to="info" className="nav-link"> <span className="info item"><img src={info} alt="home-info"className="icon"></img>Informacje</span></Link>
          <Link to="news" className="nav-link item-1"><span className="news item"><img src={news} alt="home-news" className="icon"></img><span className="text-down2">Wiadomości</span></span></Link>
          <Link to="settings" className="nav-link"><span className="settings item"><img src={settings} alt="home-settings" className="icon"></img>Ustawienia</span></Link>
        </nav>
      </section>
    )
}
export default NavBar