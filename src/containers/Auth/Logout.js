import React, {Component} from 'react';
import axios from 'axios';
import './Auth.css'
import {Redirect} from 'react-router-dom';
import AuthContext from './../../context/auth-context';

class Logout extends Component {
    state = {
        submitted:false
    }
       
    static contextType=AuthContext;
    logoutHandler = () => {
        
        axios.get('http://127.0.0.1:5050/user/logout', {withCredentials:true})
             .then(response => {
                 console.log(response);
                 console.log(document.cookie);
                 this.setState({submitted:true});
                 this.context.login();
             })
             .catch(error => {
                 console.log(error.response.data);
             });
    }
     
    render() {
        let redirect = null;
        if (this.state.submitted) {
            redirect = <Redirect to="/post" />;
        }
        return (
            <div className="Auth"> 
            {this.context.authenticated? 
              <div> 
              {redirect}
             <button onClick={this.logoutHandler}>LOGOUT</button> 
            </div>:null}</div>
        );
    }
}

export default Logout;