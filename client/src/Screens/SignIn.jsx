import React, {useState, useRef} from 'react';
import consts from '../Includes/consts';
import axios from 'axios';
import "../Styles/SignIn.css"
const SignIn = () =>
{
    const [tmpData, setTmpData] = useState(false)
    const UserLogin = useRef(null);
    const UserPassword = useRef(null);

    const SendUserData = async () =>{
    try {
        const response = await axios.post(consts.PREURL + consts.SERVER_PORT + '/user/SignIn', {UserLogin: UserLogin.current.value, UserPassword: UserPassword.current.value});
        setTmpData(response.data);
        console.log(response.data);

    }catch (error) {
        console.error(error);
    }
    }
    return(
        <section class = "box">
            <p>cso</p>
            <input type="text" ref={UserLogin}></input>
            <input type="password" ref={UserPassword}></input>
            <button onClick={SendUserData}>Zaloguj</button>
        </section>
    )
}
export default SignIn