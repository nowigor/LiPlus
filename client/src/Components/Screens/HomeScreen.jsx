import axios from "axios";
import React, {useEffect, useState} from 'react';
import consts from "../../Constants/ServerConsts";
import SingleNotification from "../SingleNotification";
import '../../Styles/HomeScreen.css';
const HomeScreen = () =>
{
  const notifications = [
    {id: 1, title: 'Sprawdzian', subject: 'Język Polski', topic: 'Lalka, Bolesłas Prus', description: 'opis sprawdzianu ', icon: 'red_warning'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: 'TO jest jaki dosyć fługo opis sprawdoizanui i zobacyzmy jak się on ułozy', icon: 'yellow_warning'},
    {id: 2, title: 'Zadanie domowe', subject: 'Programowanie zaawansownych aplikacji weebowych', topic: 'WYkonaj całe zadania zadane na stronie i w tym i mamtym i terazprzejdz do pdf i zrob dobrze', description: '', icon: 'green_warning'},
    {id: 2, title: 'Strój sportowy', subject: 'Wychowanie Fizyczne', topic: null, description: "Spakuj strój do wychowania fizycznego", icon: 'blue_wf'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: '', icon: 'yellow_warning'},
    {id: 2, title: 'Kartkówka', subject: 'Matematyka', topic: 'Ciągi, i monotoniczność ciag', description: '', icon: 'green_backpack'},
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