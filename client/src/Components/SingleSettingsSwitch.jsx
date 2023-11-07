import {useState, React} from "react";
import "../Styles/SingleSettingsSwitch.css"

const SingleSettingsSwitch = ({id, title, state }) =>
{
    const [switchClicked, setSwitchClicked] = useState(state);
    const localStorage_key = title+"_"+id;
    const HandleClick = () =>{
        if(!switchClicked)
        {
            localStorage.setItem(localStorage_key,true);
        }
        else
        {
            localStorage.removeItem(localStorage_key);
        }
        setSwitchClicked(!switchClicked);
    }
    return(
        <section className="switches-wrapper bg">
            <div className="single-switch-title"> {title}</div>
            <div className="single-switch-wrapper">
                <div className={`single-switch ${localStorage.getItem(localStorage_key) ? "single-switch-selected" : "single-unswitch-selected"}`} onClick={HandleClick}>
                <div className={`white-circle ${localStorage.getItem(localStorage_key) ? "white-circle-selected" : "white-circle-unselected"}`}></div>
                </div>
            </div>
        </section>
    )
}
export default SingleSettingsSwitch;