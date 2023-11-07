import React from 'react';
import "../Styles/Counts.css"

const Counts = ({counters}) => {
    return (
        <section className="grades-box">
            {/* {console.log(counters)} */}
           {counters.map(element => {
            return (
                <div>{element.type + " " + element.count}</div>
            )
           })}
        </section>
    )
}

export default Counts;
