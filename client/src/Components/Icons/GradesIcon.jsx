import React from 'react';
import { useState, useEffect } from 'react';
import "../../Styles/screen.css"

const GradesIcon = (e) => {

    const [fillColor, setFillColor] = useState("#747474")
    useEffect(() => {
        // setFillColor("green")
     }, [e.color]);
  
  return (
    <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg" className='icon'>
        <path d="M53.9877 0C61.1844 0 64.8382 3.52651 64.9815 10.513L64.9859 10.9451V54.0549C64.9859 61.1826 61.476 64.8517 54.4239 64.9956L53.9877 65H11.3312C4.16881 65 0.448482 61.5075 0.302534 54.489L0.298065 54.0549V10.9451C0.298065 3.78269 3.87515 0.14693 10.897 0.00436412L11.3312 0H53.9877ZM53.8823 5.68436H11.4366C8.03627 5.68436 6.0838 7.43686 5.96137 10.8778L5.95525 11.2276V53.7724C5.95525 57.3259 7.79803 59.193 11.1014 59.3098L11.4366 59.3156H53.8823C57.2486 59.3156 59.2 57.5631 59.3224 54.1222L59.3285 53.7724V11.2276C59.3285 7.67409 57.4858 5.80696 54.2142 5.6902L53.8823 5.68436ZM14.6517 44.5514C16.3077 44.5514 17.6501 45.9003 17.6501 47.5643C17.6501 49.2282 16.3077 50.5771 14.6517 50.5771C12.9958 50.5771 11.6534 49.2282 11.6534 47.5643C11.6534 45.9003 12.9958 44.5514 14.6517 44.5514ZM52.404 44.5514C53.9094 44.5514 55.1298 45.9003 55.1298 47.5643C55.1298 49.2282 53.9094 50.5771 52.404 50.5771H27.8718C26.3664 50.5771 25.146 49.2282 25.146 47.5643C25.146 45.9003 26.3664 44.5514 27.8718 44.5514H52.404ZM14.6517 29.4871C16.3077 29.4871 17.6501 30.836 17.6501 32.5C17.6501 34.164 16.3077 35.5129 14.6517 35.5129C12.9958 35.5129 11.6534 34.164 11.6534 32.5C11.6534 30.836 12.9958 29.4871 14.6517 29.4871ZM52.404 29.4871C53.9094 29.4871 55.1298 30.836 55.1298 32.5C55.1298 34.164 53.9094 35.5129 52.404 35.5129H27.8718C26.3664 35.5129 25.146 34.164 25.146 32.5C25.146 30.836 26.3664 29.4871 27.8718 29.4871H52.404ZM14.6517 14.4229C16.3077 14.4229 17.6501 15.7718 17.6501 17.4357C17.6501 19.0997 16.3077 20.4486 14.6517 20.4486C12.9958 20.4486 11.6534 19.0997 11.6534 17.4357C11.6534 15.7718 12.9958 14.4229 14.6517 14.4229ZM52.404 14.4229C53.9094 14.4229 55.1298 15.7718 55.1298 17.4357C55.1298 19.0997 53.9094 20.4486 52.404 20.4486H27.8718C26.3664 20.4486 25.146 19.0997 25.146 17.4357C25.146 15.7718 26.3664 14.4229 27.8718 14.4229H52.404Z" fill={fillColor}/>
    </svg>
    
  );
};

export default GradesIcon;