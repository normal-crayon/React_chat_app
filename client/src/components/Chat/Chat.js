import React, { useState, useEffect} from 'react'
import queryString from 'query-string'
import io, { Socket } from 'socket.io-client'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import './Chat.css'
var socket;

const Chat = ({ location }) =>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState('')
    const [messages, setMessages] = useState([]);
    const endpoint = 'http://localhost:5000';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        
        socket = io(endpoint, {transports:['websockets']});
        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error)=>{
            if(error){
                alert(error);
            }

        });

        return () =>{
            socket.disconnect();
            socket.off();
        }
        
    }, [endpoint, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    console.log(messages, message);
 return(
     <div className="outerContainer">
         <div className="container">
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            {/* <input value={message}
             onChange={(event) => setMessage(event.target.value)}
             onKeyPress={event=>event.key === 'Enter' ? sendMessage(event) : null}>
             </input> */}

         </div>
     </div>
 )   
}

export default Chat;