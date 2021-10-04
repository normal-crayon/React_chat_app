import React from 'react';

import './InfoBar.css'

import onIcon from '../Icons/online.png';
import closeIcon from '../Icons/close.png';

const InfoBar = ( {room} ) => (
    <div className="InfoBar">
        <div className="leftInnerContainer">
            <img className="onlineIcon" src={onIcon} alt="online icon"></img>
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/"><img className="closeIcon" src={closeIcon} alt="close icon"></img></a>
        </div>
         
    </div>
)

export default InfoBar;