import axios from "axios";
import React, {useEffect, useState} from 'react';
import consts from "../../Constants/ServerConsts";
import SingleNotification from "../SingleNotification";
import '../../Styles/HomeScreen.css';
const HomeScreen = () =>
{
  const notifications = [
    {id: 1, title: 'Sprawdzian', subject: 'Język Polski', topic: 'Lalka, Bolesłas Prus', description: 'opis sprawdzianu ', icon: 'yellow_backpack'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: 'TO jest jaki dosyć fługo opis sprawdoizanui i zobacyzmy jak się on ułozy', icon: 'ikona2.png'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'lgj dsllbgsdk gdkb gelkr,gvh a,mvn,djmhgvs ,rhmk,jdmfhvkgdm xgfvbdj ,mb,dj mfb, dxvmvmch', description: '', icon: 'ikona2.png'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: '', icon: 'ikona2.png'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: '', icon: 'ikona2.png'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: '', icon: 'ikona2.png'},
  ]
    const getTimetable = async () =>{
        try {
          const response = await axios.post(consts.preURL + '/api/timetable/today');
          console.log(response.data.data);
        } catch (error) {
          console.error(error);
        }
      }
    return(
        <section className="flex-wrapper">
          <h1>Czwartek, 26 październik</h1>
            <section className="notifications-wrapper">
              {
                notifications.map((e,i ) => {
                  return(
                    <SingleNotification element={e} index={i} key={i + e.subject}/>
                  )
                })
              }
            </section>
            <section className="timetable-wrapper shadow">
            </section>
        </section>
            // <button onClick={getTimetable}>GetTime table</button> */}
    )
}
export default HomeScreen