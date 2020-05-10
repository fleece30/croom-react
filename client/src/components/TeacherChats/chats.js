/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import './chats.css';
import socketIOClient from "socket.io-client";
import { withRouter } from 'react-router-dom';
import Qs from 'qs';
import { initBroadcast, playStream } from '../../agora-teacher-interface';

let socket;


class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            room: '',
            type: '',
            chatMessages: [],
            text: '',
            teacher: {},
            userList: []
        }
    }

    componentDidMount() {

        socket = socketIOClient('http://localhost:5000');


        const { username, room, type } = Qs.parse(this.props.match.params.userdesc, {
            ignoreQueryPrefix: true
        });

        console.log(room);

        this.setState({
            username,
            room,
            type
        });

        initBroadcast(room);

        socket.emit('joinroom', { username, room, type, allowed: false });
        socket.on('message', message => {
            this.outputMessage(message);

            //scroll to bottom
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            this.setState({ text: '' });
        });
        socket.on('roomUsers', ({ room, users }) => {
            this.setState({ userList: users });
            const teacher = users.find(user => user.type === 'teacher');
            this.setState({ teacher: teacher });
            this.outputUsers(users);
        });
    }

    publish(ev) {
        ev.preventDefault();
        const target = ev.target;

        if (target.innerText === "Screen share") {
            target.innerText = "Video share";
        } else {
            target.innerText = "Screen share";
        }

        playStream();
    }

    outputUsers = users => {
        return (
            users.map((user, key) => {
                if (user.type === 'teacher') {
                    return false;
                }
                else {
                    return (
                        <div key={key} className="chatUsers">
                            <li>{user.username}</li>
                            <button id={user.id} className="button" onClick={(event) => this.handleClick(event, users)} style={{ display: (user.type === "student" && this.state.type === "teacher") ? "block" : "none" }}>
                                {user.allowed ? <span id={user.id}><i id={user.id} className="fal fa-times"></i> Disallow</span> : <span id={user.id}><i id={user.id} className="far fa-check"></i> Allow</span>}
                            </button>
                            <span style={{ display: !(user.type === "student" && this.state.type === "teacher") ? "block" : "none" }}></span>
                            <button id={user.id} className="button" style={{ display: (user.type === "student" && this.state.type === "teacher") ? "block" : "none" }}>
                                View Video
                            </button>
                            <span style={{ display: !(user.type === "student" && this.state.type === "teacher") ? "block" : "none" }}></span>
                            <button id={user.id} className="button" style={{ float: "right" }}>
                                {user.muted ? <span id={user.id}><i id={user.id} className="fas fa-volume"></i> Unmute</span> : <span id={user.id}><i id={user.id} className="fas fa-volume"></i> Mute</span>}
                            </button>
                        </div>
                    )
                }
            })
        )
    }

    handleClick = (e, users) => {
        const kickToggleId = e.target.id;
        const a = users.find(user => user.id === kickToggleId);
        a.allowed = !a.allowed;
        socket.emit('changeArray', kickToggleId);
        this.setState({ userList: users });
        this.outputUsers(users);
    }

    outputMessage = (msg) => {
        this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    }

    postMessages = () => {
        return (
            this.state.chatMessages.map((msg, key) => {
                return (
                    <div key={key} className={this.state.username === msg.username ? "message" : "other-mess"}>
                        <p className="meta">{msg.username} <span>{msg.time}</span></p>
                        <p className="text">
                            {msg.text}
                        </p>
                    </div>
                )
            })
        );
    }

    raiseHand = () => {
        socket.emit('requesting', this.state.username);
    }
    onSubmit = e => {
        e.preventDefault();

        const msg = e.target.elements.msg.value;
        //emit messsage to server
        socket.emit('chatMessage', msg);
    }

    render() {
        return (
            <div>
                {/* nav */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="https://google.com/">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-item nav-link active" href="https://google.com/">Home <span className="sr-only">(current)</span></a>
                            <a className="nav-item nav-link" href="https://google.com/">Features</a>
                            <a className="nav-item nav-link" href="https://google.com/">Pricing</a>
                            <a className="nav-item nav-link disabled" href="https://google.com/">Disabled</a>
                        </div>
                    </div>
                </nav>
                {/* nav end */}

                <div className="page-container">
                    <div className="course-container">
                        <div className="video">
                            <div id="play-area"></div>
                            
                        </div>

                        <div><button className="publish-button" onClick={(e) => this.publish(e)}>Start Video Broadcast</button></div>

                        <div className="course-info">
                            <p><b>Course Name |</b> <i>Chapter Name</i></p>
                        By Prof <b>Arul. Kumar</b>
                        </div>
                    </div>
                    {/* <Users userState={this.state}/> */}
                    <div className="participants">
                        <ul id="teacher" style={{ display: "grid", gridTemplateColumns: "50% 50%", padding: "8px" }}>
                            <li>{this.state.teacher.username}</li>
                            <button id={this.state.teacher.id} className="button" style={{ justifySelf: "end", width: "40%", padding: "12px", fontSize: "11px" }}>
                                {this.state.teacher.muted ? <span id={this.state.teacher.id}><i id={this.state.teacher.id} className="fas fa-volume"></i> Unmute</span> : <span id={this.state.teacher.id}><i id={this.state.teacher.id} className="fas fa-volume"></i> Mute</span>}
                            </button>
                        </ul>
                        <div className="user-heading">
                            <h4>Online Members •</h4>
                            <button className="button" style={{ fontSize: "12px" }}><i className="fas fa-volume"></i> Mute All</button>
                        </div>
                        <ul id="users">
                            {this.outputUsers(this.state.userList)}
                        </ul>
                        <div className="chat-container">
                            <div className="chat-messages">
                                {this.postMessages()}
                            </div>
                            <div className="chat-form-container">
                                <form id="chat-form" onSubmit={event => this.onSubmit(event)}>
                                    <input
                                        id="msg"
                                        type="text"
                                        placeholder={this.state.type === 'teacher' ? 'Type your answer here...' : 'Type your query here...'}
                                        required
                                        autoComplete="off"
                                        value={this.state.text}
                                        onChange={(e) => this.setState({ text: e.target.value })}
                                        style={{ width: this.state.type === 'teacher' ? '100%' : '75%' }}
                                    />
                                </form>
                                <button className="raise-btn" onClick={() => this.raiseHand()} style={{ display: this.state.type === 'student' ? "block" : "none", marginLeft: "10px!important" }}><i className="fal fa-hand-paper"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Chats);
