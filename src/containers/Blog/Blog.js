import React, { Component } from 'react';
import axios from 'axios';

import { Route} from 'react-router-dom';

import MyPost from '../../components/Post/MyPost';
import Post from '../../components/Post/Post';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';
import Login from './../Auth/Login';
import Logout from './../Auth/Logout';
import SignUp from './../Auth/SignUp';
import AuthContext from './../../context/auth-context';

class Blog extends Component {
    
    state = { posts: []  } 

    static contextType=AuthContext;
   
    componentDidMount () {
        axios.get('http://127.0.0.1:5050/post')
             .then(response => { 
                 this.setState({posts:response.data.data.posts });
                console.log(response); })
                .catch(error => { console.log(error); });

    }
    checkHandler = () => {
        console.log('hi there');
        console.log(this.props);
    }

    postDeleteHandler = (id) => {
        axios.delete('http://127.0.0.1:5050/post/'+id, {withCredentials:true})
        .then(response => { this.setState({posts: this.state.posts.filter( el => el._id!==id) });
            console.log(response); })
        .catch(error => { console.log(error)});
        
    }

    addPostHandler = (post) => {
        const updatedPosts = this.state.posts;
        updatedPosts.unshift(post);
        this.setState({posts: updatedPosts });
    }
    

    render () {
        this.checkHandler();

        const posts = this.state.posts.map(post => {  
            if(!post.blacklist){
            let likes=0, dislikes=0, match=false, review;
            if(post.rxn){ post.rxn.forEach(el => {
             if(!match && this.context.currentUser && (JSON.stringify(el.user) === JSON.stringify(this.context.currentUser._id)))
             {match=true; review=el.review; }   
             if(el.review === 'upVote') likes++;
             else if(el.review === 'downVote') dislikes++;
             else ;
            }); }
            return <Post key={post._id} author={post.author} content={post.content} id={post._id}
                         upVote={likes} downVote={dislikes} review={review} />
        } else return null;}) 
        
        
        let myposts = null;
        if(this.context.authenticated) {
           myposts = this.state.posts.map(post => { if(post.author === this.context.currentUser.username)
                return <MyPost key={post._id} author={post.author} content={post.content} blacklist={post.blacklist}
                             delete={() => this.postDeleteHandler(post._id)}/>; else return null; }); 
        }

        let addpost = <NewPost add={this.addPostHandler}/>;
        return (
            <div className="Posts">
              
                <Route path="/post" exact render={() => posts } />
                <Route path="/addpost" exact render={() => addpost} />
                <Route path="/login" exact component={Login} />
                <Route path="/logout" exact component={Logout} />
                <Route path='/user/myPosts' exact render={() => myposts }/>
                <Route path='/user/signup' exact component={SignUp}/>
            </div>
        );
    }
}

export default Blog;