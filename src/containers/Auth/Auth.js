import React, {Component} from 'react';
import axios from 'axios';
import './Auth.css'

class Auth extends Component {
    state = {
        email: '',
        password: '',
        isLoggedIn: false,
        currentUser: null
    }

       
    isLoginHandler = () => {
        
        axios.get('http://127.0.0.1:5050/user/isLoggedIn', {withCredentials:true})
             .then(response => {
                 console.log(response);
                 this.setState({isLoggedIn:true, currentUser:response.data.data.user});
             })
             .catch(error => {
                 console.log(error);
             });
    }
    
    componentDidMount () {
        this.isLoginHandler();
      }

    loginHandler = () => {
        const data = {
            email:this.state.email,
            password:this.state.password
        }
        axios.post('http://127.0.0.1:5050/user/login', data, {withCredentials:true})
             .then(response => {
                 console.log(response);
                 console.log(document.cookie);
                 this.setState({isLoggedIn:true});
             })
             .catch(error => {
                 console.log(error.response.data);
             });
    }
    logoutHandler = () => {
        
        axios.get('http://127.0.0.1:5050/user/logout', {withCredentials:true})
             .then(response => {
                 console.log(response);
                 console.log(document.cookie);
             })
             .catch(error => {
                 console.log(error.response.data);
             });
    }
     
    render() {
       
        return (
            <div className="Auth">
               { !this.state.isLoggedIn ?    
               <div>
                <h1>Login</h1>
                <label>email</label>
                <input type="text" value={this.state.email} onChange={(event) => this.setState({email: event.target.value})} />
                <label>password</label>
                <input type="text" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} />
                <button onClick={this.loginHandler}>LOGIN</button> </div>
                : <button onClick={this.logoutHandler}>LOGOUT</button> }
            </div>
        );
    }
}

export default Auth;