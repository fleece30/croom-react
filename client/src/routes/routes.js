import React, { Component } from 'react';
import Login from '../components/Login/login';
import Chats from '../components/TeacherChats/chats';
import StudentChats from '../components/StudentChats/studentChat'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <Route path="/teacherchats:userdesc" exact component={Chats}/>
                    <Route path="/studentchats:userdesc" exact component={StudentChats}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;