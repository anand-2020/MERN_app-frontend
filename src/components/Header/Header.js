import React, { Component } from 'react';
import { Router, NavLink, Route } from 'react-router-dom';
import axios from 'axios';
import './Header.css'

class Header extends Component {
  state = {
    isLoggedIn : false,
    currentUser : null
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

  render() {
    return (
      <div className="Header">
        <h2>{this.state.isLoggedIn}</h2>
        <nav>
            <ul>
                <li><NavLink
                                to="/post/"
                                exact
                                activeClassName="my-active"
                                activeStyle={{
                                    color: '#fa923f',
                                    textDecoration: 'underline'
                                }}>Posts</NavLink></li>
                 <li><NavLink to={{
                                pathname: '/addpost',
                                hash: '#submit'
                            }}>Add Post</NavLink></li>
                            <li><NavLink to={{
                                pathname: '/login',
                                hash: '#submit'
                            }}>Login/Logout</NavLink></li>
            </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
