import React from 'react';
import loading from "../../Includes/loading/loading.gif"
import "../../Styles/Loading.css"
const LoadingScreen = () =>
{

    return (
        <section className='loading-wrapper'>
            <img src={loading} className='loading'></img>
        </section>
    )
}
export default LoadingScreen