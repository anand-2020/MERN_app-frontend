import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './../../context/auth-context';
import './Header.css'
import image from './../../asset/appheader.jpg';


class Header extends Component {
  static contextType=AuthContext;

  render() {
    return (
      <div className="Header">
        <div>
        <img src={image} alt="mainphoto"className="myimg" />
        </div>
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
                 {this.context.authenticated?<li><NavLink to={{
                                pathname: '/addpost',
                                hash: '#submit'
                            }}>Add Post</NavLink></li>:null}
                 {!this.context.authenticated?<li><NavLink to={{
                                pathname: '/login'
                            }}>Login</NavLink></li>:
                            <li><NavLink to={{
                              pathname: '/logout',
                              hash: '#submit'
                          }}>Logout</NavLink></li>}
                    {this.context.authenticated?<li><NavLink to={{
                                pathname: '/user/myPosts'
                            }}>MY POSTS</NavLink></li>:null}
                   {!this.context.authenticated?<li><NavLink to={{
                                pathname: '/user/signup'
                            }}>SignUp</NavLink></li>:null}
                    {(this.context.authenticated && this.context.currentUser.role === 'admin')?<li><NavLink to={{
                                pathname: '/user'
                            }}>Users</NavLink></li>:null}                       
            </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
