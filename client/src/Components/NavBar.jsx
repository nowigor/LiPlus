import "../Styles/NavBar.css";
import React from "react";
const NavBar = () =>
{
    const getData = () =>
  {
    fetch(preURL + "/")
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error=> console.log(error))
  }
  const LogIn = async () =>{
    try {
      const response = await axios.post(preURL + '/user/auth/login', {UserLogin: UserLogin.current.value, UserPassword: UserPassword.current.value});
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  const LogOut = async () =>{
    try {
      const response = await axios.post(preURL + '/user/auth/logut');
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  const getTimetable = async () =>{
    try {
      const response = await axios.post(preURL + '/api/timetable/today');
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
    return(
        <section class="wrapper">
            <div class="navItem">Cos</div>
            <div class="navItem">Cos</div>
            <div class="navItem">Cos</div>
            <div class="navItem">Cos</div>
            <div class="navItem">Cos</div>
            <div class="navItem">Cos</div>
            <div class="navItem">Cos</div>
        </section>
    )
}
export default NavBar