import React, {seState, useRef, useState, useEffect} from 'react';
import axios from "axios";
import consts from "../../Includes/consts";
const Login = ({authorized}) =>
{
    const UserLogin = useRef(null);
    const UserPassword = useRef(null);
    const rememberMe= useRef(null);
    const [render, SetRender] = useState(true);
    
    useEffect(() => {
       AutoLogin();
      }, []);

    const LogIn = async (login, password) =>{
        let result = false;
        try {
            const response = await axios.post(consts.preURL + '/user/auth/login', {UserLogin: login, UserPassword: password});
            result = true;
        } 
        catch (error){}
        return result;
    }

    const HandleLogin = async () =>{
       console.log(localStorage)
        const login = UserLogin.current.value;
        const password =UserPassword.current.value;  
        if(login && password )
        {
            if(await LogIn(login, password))
            {
                authorized(true);
                SetRender(false);
                if(rememberMe.current.checked)
                {
                    localStorage.setItem('UserLogin', login);
                    localStorage.setItem('UserPassword', password);
                    // console.log(localStorage.getItem('UserPassword'))
                }
            }
        }
    }
    const AutoLogin = async ()=>
    {
        if(localStorage.length > 0 && await LogIn(localStorage.getItem('UserLogin'), UserPassword),localStorage.getItem('UserPassword')){
            SetRender(false);
            authorized(true);
        }
    }
    return (
        <>
        {render && 
        <section className="Login-Section">
           <input type="text" ref={UserLogin}></input>
           <input type="password" ref={UserPassword}></input>
           <input type="checkbox" ref={rememberMe} name='rememberme'></input>
           <label htmlFor="rememberme">Zapamiętaj mnie</label>
          <button onClick={HandleLogin}>Zaloguj</button>
          {/* <button onClick={LogOut}>Wyloguj się</button> */}
        </section>
        }
        </>
      );
}
export default Login