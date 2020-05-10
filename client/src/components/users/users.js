import React, { Component } from 'react';
import '../Chats/chats.css';
import socketIOClient from "socket.io-client";
import Qs from 'qs';

let socket;

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            room: '',
            type: '',
            chatMessages: [],
            users: []
        }
    }
    //get users in the room
    componentWillMount() {
        socket = socketIOClient('http://localhost:5000');
        this.setState({
            username: this.props.userState.username,
            room: this.props.userState.room,
            type: this.props.userState.type
        })
        socket.on('roomUsers', ({room, users}) => {
            this.setState({users: [...users, users]});
            console.log(users);
            this.outputUsers(users);
        });
        console.log('aa');
    }

    outputUsers = users => {
        console.log('awd');
        const userList = document.querySelector('#users');
        const teacherName = document.querySelector('#teacher');
        while(userList.hasChildNodes()){
            userList.removeChild(userList.firstChild);
        }
        while(teacherName.hasChildNodes()){
            teacherName.removeChild(teacherName.firstChild);
        }

        users.map(user => {
            console.log(user);
            // const div = document.createElement('div');
            // div.className = 'chatUsers';
            // const button = document.createElement('button');
            // const muteButton = document.createElement('button');
            // const viewButton = document.createElement('button');
            // button.id = user.id;
            // muteButton.id = user.id;
            // viewButton.id = user.id;
            // button.className = 'button';
            // muteButton.className = 'button';
            // viewButton.className = 'button';
            // button.innerHTML = user.allowed ? "<i class=\"fal fa-times\"></i> Disallow" : "<i class=\"far fa-check\"></i> Allow";
            // muteButton.innerHTML = user.muted ? "<i class=\"fas fa-volume\"></i> Unmute" : "<i class=\"fas fa-volume\"></i> Mute";
            // viewButton.innerHTML = "View Video";
            // button.onclick = (event) => this.handleClick(event, users);
            // const listElement = document.createElement('li');
            // listElement.innerHTML = user.username;
            // div.appendChild(listElement);
            // if(user['type'] === "student" && type === "teacher"){
            // div.appendChild(button);
            // div.appendChild(viewButton);
            // }else{
            // const span1 = document.createElement('span');
            // const span2 = document.createElement('span');
            // div.appendChild(span1);
            // div.appendChild(span2);
            // }
            // div.append(muteButton);
            // user['type'] === 'teacher' ? (type === 'student' ? teacherName.appendChild(div) : null)  : userList.appendChild(div);
        })
    }

    handleClick = (e, users) => {
    const kickToggleId = e.target.id;
    const a = users.find(user => user.id === kickToggleId);
    a.allowed = !a.allowed;
    socket.emit('changeArray', kickToggleId);
    this.outputUsers(users);
    }

    render() {
        return (
            <div className="participants">
                <ul id="teacher"></ul>
                <div className="user-heading">
                    <h4>Online Members •</h4>
                    <button className="button" style={{fontSize: "12px"}}><i className="fas fa-volume"></i> Mute All</button>
                </div>
                <ul id="users">
                </ul>
            </div>
        )
    }
}

export default Users;