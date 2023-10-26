import React from "react";
import "../Styles/SingleNotifications.css";
import pack from "../Includes/icons/notifications/green_backpack.png";
const SingleNotification = ({element, index}) =>
{
    const preUrl = "../../Includes/icons/notifications/";
    return(
        <div className="sigle-notification shadow" >
            <img src={preUrl + element.icon + ".png"} className="noti-icon"></img>
            <h1 className="noti-title">{element.title}</h1>
            <span className="noti-subject bolded">Przedmiot: <span className="noti-subject-text normal-text">{element.subject}</span></span>
            <div className="noti-topic bolded">Temat: <div className="noti-topic-text normal-text">{element.topic}</div></div>
            <div className="noti-description">{element.description}</div>
        </div>
    )
}
export default SingleNotification;