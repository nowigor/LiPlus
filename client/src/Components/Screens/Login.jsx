import React, {useRef, useState, useEffect} from 'react';
import axios from "axios";
import LoadingScreen from '../LoadingScreen';
import consts from "../../Includes/consts";
import "../../Includes/loading/loading.gif";
import '../../Styles/Login.css'
const Login = ({authorized}) =>
{
    const UserLogin = useRef(null);
    const UserPassword = useRef(null);
    const rememberMe= useRef(null);
    const [render, SetRender] = useState(false);
    
    useEffect(() => {
       AutoLogin();
      });

    const LogIn = async (login, password) =>{
        let result = false;
        try {
            await axios.post(consts.preURL + '/user/auth/login', {UserLogin: login, UserPassword: password});
            result = true;
        } 
        catch (error){}
        return result;
    }

    const HandleLogin = async () =>{
       console.log(localStorage)
       localStorage.clear();
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
                }
            }
            else
            {
                SetRender(true)
            }
        }
        else
        {
            SetRender(true)
        }
    }
    const AutoLogin = async ()=>
    {
        if(localStorage.length > 0 && await LogIn(localStorage.getItem('UserLogin'), localStorage.getItem('UserPassword'))){
            SetRender(false);
            authorized(true);
        }
        else
        {
            SetRender(true);
        }
    }
    return (
        <>
        {render && 
        <section className="Login-Section">
            <div className='WaveUp'></div>
            <div className='text-main shadow'>
                <h1><b>Witaj w LiPlus</b></h1>
            </div>
            <article className='form-wrapper shadow'>
                <input type="text" ref={UserLogin} className='input login shadow' placeholder='Nazwa użytkownika*'></input>
                <input type="password" ref={UserPassword} className='input password shadow' placeholder='Hasło*'></input>
                <button onClick={HandleLogin} className='button shadow'>Zaloguj</button>
                <div className="utlis-wrapper">
                    <span className='checkbox'>
                        <input type="checkbox" ref={rememberMe} name='rememberme'></input>
                        <label htmlFor="rememberme" className='text-label'>Zapamiętaj mnie</label>
                    </span>
                    <span className='text-forget'><a target="_blank" rel="noopener noreferrer" href='https://portal.librus.pl'>Przypomnij hasło</a></span>
                </div>
                <span className='text-desc'>* zaloguj się loginem i hasłem do portalu LIbrus </span>
            </article>
          <div className='WaveDown'></div>
        </section>
        }
        {render === false ? (
            <LoadingScreen/>
        ): null }
        </>
      );
}
export default Login