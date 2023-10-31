import React, { useRef, useState } from "react";
import "../../Styles/ScreenSwitch.css"

export function ScreenSwitch({ options, active, setActive, onClick }) {
    const activeDiv = useRef();
    const activeDivStyle = {
        width: `${(100 / options.length)}%`,
        marginLeft: `${(100 / options.length) * options.indexOf(active)}%`
    }

    const select = e => {
        if (active !== e) {
            activeDiv.current.style.marginLeft = `${(100 / options.length) * options.indexOf(e)}%`
            setTimeout(() => {
                onClick[e]()
                setActive(e)
            }, 300)
        }
    }

    return (
        <section className="switch-wrapper">
            <div className="background">
                {
                    options.map(e => {
                        const style = { width: `${(1 / options.length) * 100}%` }

                        return (
                            <div className='option' style={style} onClick={() => select(e)}>
                                <p>{e}</p>
                            </div>
                        )
                    })
                }
                <div ref={activeDiv} className="active" style={activeDivStyle}></div>
            </div>
        </section>
    )
}
