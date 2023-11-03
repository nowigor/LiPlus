import React from "react";
import { useEffect, useState } from "react";
import "../Styles/SingleNotifications.css";
const SingleNotification = ({element, index}) =>
{
    const image = require(`../Includes/icons/notifications/${element.icon}.png`)
    const bolded_days = `<b>${element.days}</b>`;
    const newDesc = element.description.replace(element.days.toString(), bolded_days)
    const dateParts = element.date.split("-");
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    return(
        <div className="sigle-notification shadow" >
            <img src={image} className="noti-icon" alt = {element.icon}></img>
            <h1 className="noti-title ">{element.title}</h1>
            <div className="noti-subject bolded">Przedmiot: <div className="noti-topic-text normal-text">{element.subject}</div></div>
            {element.topic !== null &&<div className="noti-topic bolded">Temat: <div className="noti-topic-text normal-text">{element.topic}</div></div>}
           {element.description !== null && <div className="noti-description" dangerouslySetInnerHTML={{ __html: newDesc }}>
            </div>}
            {/* {element.days && <div className="noti-days-left">zostało: {element.days} dni</div>} */}
            {element.date && <div className="noti-date">{formattedDate}</div>}
        </div>
    )
}
export default SingleNotification;