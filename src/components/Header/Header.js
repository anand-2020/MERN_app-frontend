import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './../../context/auth-context';
import './Header.css';
import axios from 'axios';

class Header extends Component {
  static contextType=AuthContext;
  logoutHandler = () => {
      
      axios.get('http://127.0.0.1:5050/user/logout', {withCredentials:true})
           .then(response => {
               this.context.login();
           })
           .catch(error => {
               console.log(error.response.data);
           });
  }

  render() {
    return (
      <div className="Header">
         <div className="PP">PostPlay</div> 
        <nav>
            <ul>
                <li><NavLink
                                to="/post/"
                                exact
                                >Posts</NavLink></li>
                 {<li><NavLink to={{
                                pathname: '/addpost',
                                hash: '#submit'
                            }}>Add_Post</NavLink></li>}
                 {this.context.authenticated?<li><NavLink to={{
                                pathname: '/user/myPosts'
                            }}>My_Posts</NavLink></li>:null}
                  {this.context.authenticated ?<li><NavLink to={{
                                pathname: '/user/profile'
                            }}>Profile</NavLink></li>:null} 
                 {!this.context.authenticated?<li><NavLink to={{
                                pathname: '/login'
                            }}>Login</NavLink></li>:
                           <button className="Out" onClick={this.logoutHandler}>Logout</button>}
                   {!this.context.authenticated?<li><NavLink to={{
                                pathname: '/user/signup'
                            }}>SignUp</NavLink></li>:null}
                    {(this.context.authenticated && this.context.currentUser.role === 'admin')?<li><NavLink to={{
                                pathname: '/user' 
                            }} exact>Users</NavLink></li>:null} 
                 
                     {this.context.authenticated ?<li><NavLink to={{
                                pathname: '/user/changePassword'
                            }}>Change_Password</NavLink></li>:null}
                         
            </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
