import React, { Component } from 'react';
import axios from 'axios';

import { Route, NavLink } from 'react-router-dom';

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';
import Login from './../Auth/Auth';


class Blog extends Component {
    
    state = { posts: [], selectedPostId: null }

    componentDidMount () {
        axios.get('http://127.0.0.1:5050/post')
             .then(response => { 
                this.setState({posts: response.data.data.posts});
                console.log(response); })
                .catch(error => { /*console.log(error.response.data);*/ });
    }
    
    postSelectedHandler = (id) => {
        this.setState({selectedPostId: id});
    }

    render () {
       const posts = this.state.posts.map(post => {
            return <Post key={post._id} author={post.author} content={post.content}
                         clicked={() => this.postSelectedHandler(post._id)}/>;
        });
        return (
            <div className="Posts">
                <Route path="/post" exact render={() => posts } />
                <Route path="/addpost" exact component={NewPost} />
                <Route path="/login" exact component={Login} />
                {/*<section className="Posts">
                    {posts}
                </section>
                <section>
                    <FullPost id={this.state.selectedPostId} />
                </section>
                <section>
                    <NewPost />
                </section>
                <section>
                    <Login/>
                </section>*/}
            </div>
        );
    }
}

export default Blog;