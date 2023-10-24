import React, { useRef, useState } from "react";
import "../Styles/ScreenSwitch.css"

export function ScreenSwitch({ options, active, setActive, onClick }) {
    const activeDiv = useRef();
    const activeDivStyle = {
        width: `${(100 / options.length)}%`,
        marginLeft: `${(100 / options.length) * options.indexOf(active)}%`
    }

    return (
        <div className="background">
            {
                options.map((e, i) => {
                    const style = { width: `${(1 / options.length) * 100}%` }
                    const select = () => {
                        active = e
                        activeDiv.current.style.marginLeft = `${(100 / options.length) * i}%`
                    }

                    return (
                        <div className='option' style={style} onClick={() => { select(); onClick[e](); }}>
                            <p>{e}</p>
                        </div>
                    )
                })
            }
            <div ref={activeDiv} className="active" style={activeDivStyle}></div>
        </div>
    )
}
