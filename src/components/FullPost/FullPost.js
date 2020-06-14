import React, { Component } from 'react';
import axios from 'axios';

import './FullPost.css';

class FullPost extends Component {
    state = { loadedPost: null}

    componentDidUpdate () {
        if(this.props.id )
        {
            if(!this.state.loadedPost || (this.state.loadedPost && this.state.loadedPost._id !== this.props.id)){
            axios.get('http://127.0.0.1:5050/post/' + this.props.id  )
            .then(response => { 
                this.setState({loadedPost: response.data.data.post});
            }).catch(error => { console.log(error.response.data); }); }
        }  
    }

    render () {
        let post = <p style={{textAlign :'center'}}>Please select a Post!</p>;

        if(this.props.id){
            post = <p style={{textAlign :'center'}}>Loading</p>;
        }
        if (this.state.loadedPost) {
            post = (
                <div className="FullPost">
                    <h1>Title</h1>
                    <p>{this.state.loadedPost.content}</p>
                    <p>{this.state.loadedPost.author}</p>
                    <div className="Edit">
                        <button className="Delete">Delete</button>
                    </div>
                </div>
    
            );
        }
        
        return post;
    }
}

export default FullPost;