import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './login.css';

const MyContext = React.createContext();

class MyProvider extends Component {
	state = {
		username: '',
		room: 'Room1',
		type: 'teacher'
	}
	render() {
		return (
			<MyContext.Provider value={{
				state: this.state,
				setvalue: (e) => {
					this.setState({ [e.target.name]: e.target.value });
				}
			}}>
				{this.props.children}
			</MyContext.Provider>
		)
	}
}

class Login extends Component {
	// constructor(props) {
	//     super(props);
	//     this.
	// }

	// setvalue = (e) => {
	//     this.setState({[e.target.name]: e.target.value});
	// }

	render() {
		return (
			<MyProvider>
				<MyContext.Consumer>
					{(context => (
						<React.Fragment>
							<div className="join-container">
								<header className="join-header">
									<h1><i className="fas fa-smile"></i>ChatRoom</h1>
								</header>
								<main className="join-main">
									<form id="loginForm" action="chat.html">
										<div className="form-control">
											<label htmlFor="username">Username</label>
											<input
												type="text"
												name="username"
												id="username"
												placeholder="Enter username..."
												required
												autoComplete="off"
												onChange={context.setvalue}
											// value={this.state.username}
											/>
										</div>
										<div className="form-control">
											<label htmlFor="room">Room</label>
											{/* <select name="room" id="room" onChange={context.setvalue}>
											<option value="Room1">Room 1</option>
											<option value="Room2">Room 2</option>
											<option value="Room3">Room 3</option>
											<option value="Room4">Room 4</option>
										</select> */}
											<input
												type="text"
												name="room"
												id="room" 
												placeholder="Room name..." 
												required 
												autoComplete="off" 
												onChange={context.setvalue}
											/>
										</div>
										<div className="form-control">
											<label htmlFor="type">Type</label>
											<input type="radio" value="teacher" name="type" defaultChecked onChange={context.setvalue} /> Teacher<br />
											<input type="radio" value="student" name="type" onChange={context.setvalue} /> Student<br />
										</div><br />
										<Link to={{ pathname: `/${context.state.type === 'teacher' ? 'teacherchats' : 'studentchats'}?username=${context.state.username}&room=${context.state.room}&type=${context.state.type}` }}><button type="submit" className="btn">Join Chat</button></Link>
										<br />
									</form>
								</main>
							</div>
						</React.Fragment>
					))}
				</MyContext.Consumer>
			</MyProvider>
		);
	}
}

export default Login;