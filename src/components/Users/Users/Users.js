import React, { Component } from 'react';
import axios from 'axios';
import './Users.css';
import AuthContext from './../../../context/auth-context';
import User from './../User/User';
import Post from './../../Post/Post';

class Users extends Component {
    state = {
        users:[], posts:[], display:false
    }

    static contextType=AuthContext;

    componentDidMount() {
        axios.get('http://127.0.0.1:5050/user',{withCredentials:true})
        .then(response => { 
            this.setState({users:response.data.data.users });
           console.log(response); })
           .catch(error => { console.log(error); });
    }

    getPostHandler = (name) => {
        axios.get('http://127.0.0.1:5050/user/posts/'+name, {withCredentials:true})
        .then(response => { this.setState({posts:response.data.data.posts, display:true});
                   console.log(response);})
        .catch(error => {console.log(error); });           
    }

    changeDisplay = () => {
        this.setState({display:false, posts:[]});
    }

    render () {
        const allUsers=this.state.users.map(user => {
            return <User key={user._id}  username={user.username} role={user.role} id={user._id}
                   getPosts={() => this.getPostHandler(user.username)}
            />
        });
        const userPosts = this.state.posts.map(post => {  
            let likes=0, dislikes=0, match=false, review;
            if(post.rxn){ 
                post.rxn.forEach(el => {
                   if(!match && this.context.currentUser && (JSON.stringify(el.user) === JSON.stringify(this.context.currentUser._id)))
                   {match=true; review=el.review; }   
                   if(el.review === 'upVote') likes++;
                   else if(el.review === 'downVote') dislikes++;
                    else ;
                }); 
            }
            return <Post key={post._id} author={post.author} content={post.content} id={post._id}
                                    upVote={likes} downVote={dislikes} review={review} 
                                    blacklist={post.blacklist} blacklistAllowed={true}/>;
        });                            

        return (
            <div>
            {this.state.display? <div><button onClick={this.changeDisplay}>Close</button>{userPosts} </div>:
            <div>   
            {(this.context.authenticated && this.context.currentUser.role === 'admin')?
            <div className="NewPost">
                <h1>PostPlay Users</h1>
                 {allUsers}
            </div>:null}</div>}
            </div>
        );
    }
}


export default Users;