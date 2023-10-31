import React from "react";
import { useEffect, useState } from "react";
import "../Styles/SingleNotifications.css";
const SingleNotification = ({element, index}) =>
{
    const image = require(`../Includes/icons/notifications/${element.icon}.png`)

    return(
        <div className="sigle-notification shadow" >
            <img src={image} className="noti-icon" alt = {element.icon}></img>
            <h1 className="noti-title">{element.title}</h1>
            <div className="noti-subject bolded">Przedmiot: <div className="noti-topic-text normal-text">{element.subject}</div></div>
            {element.topic !== null &&<div className="noti-topic bolded">Temat: <div className="noti-topic-text normal-text">{element.topic}</div></div>}
            {element.description !== null && <div className="noti-description">{element.description}</div>}
        </div>
    )
}
export default SingleNotification;