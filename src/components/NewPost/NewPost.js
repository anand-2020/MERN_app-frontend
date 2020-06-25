import React, { Component } from 'react';
import axios from 'axios';
import './NewPost.css';
import AuthContext from './../../context/auth-context';
import {Redirect} from 'react-router-dom';

class NewPost extends Component {
    state = {
        content:undefined,
        submitted:false
    }

    static contextType=AuthContext;

    addPostHandler = () => {
        const data = {
            content:this.state.content
        }
        axios.post('http://127.0.0.1:5050/post', data, {withCredentials:true})
             .then(response => {
                 console.log(response);
                 this.props.add(response.data.data.post);
                 this.setState({submitted: true});
             })
             .catch(error => {
                 console.log(error);
                 window.alert('Please login to add a post');
             });
    }

    render () {
        let redirect = null;
        if (this.state.submitted) {
            redirect = <Redirect to={{
                pathname: '/post',
                state: { content:this.state.content }
            }} 
         />
       }
       
        return (
            <div>
             {redirect}   
            {this.context.authenticated?
            <div className="NewPost">
                <h1>Add a Post</h1>
              
                <label>Content</label>
                <textarea rows="4" value={this.state.content} onChange={(event) => this.setState({content: event.target.value})} />
                
                <button onClick={this.addPostHandler}>Add Post</button>
            </div>:window.alert('you are not logged in!')}
            </div>
        );
    }
}


export default NewPost;