import React, { Component } from 'react';
import axios from 'axios';
import './NewPost.css';

class NewPost extends Component {
    state = {
        title: '',
        content: '',
        author: 'Max'
    }

    addPostHandler = () => {
        const data = {
            content:this.state.content,
            author:this.state.author
        }
        axios.post('http://127.0.0.1:5050/post', data, {withCredentials:true})
             .then(response => {
                 console.log(response);
             })
             .catch(error => {
                 console.log(error.response.data);
                 window.alert('Please login to add a post');
             });
    }

    render () {
        return (
            <div className="NewPost">
                <h1>Add a Post</h1>
              
                <label>Content</label>
                <textarea rows="4" value={this.state.content} onChange={(event) => this.setState({content: event.target.value})} />
                
                <button onClick={this.addPostHandler}>Add Post</button>
            </div>
        );
    }
}

export default NewPost;