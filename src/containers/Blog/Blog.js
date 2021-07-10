import React, { Component } from "react";
import axios from "axios";

import { Route } from "react-router-dom";
import Post from "../../components/Post/Post";
import Mypost from "./../../components/Post/MyPost";
import NewPost from "../../components/NewPost/NewPost";
import "./Blog.css";
import Login from "./../Auth/Login";
import SignUp from "./../Auth/SignUp";
import AuthContext from "./../../context/auth-context";
import Users from "./../../components/Users/Users/Users";
import ChangePass from "./../Auth/ChangePass";
import Profile from "./../Auth/Profile";
import ForgotPass from "../Auth/ForgotPass";

class Blog extends Component {
  state = { posts: [] };

  static contextType = AuthContext;

  componentDidMount() {
    axios
      .get("http://127.0.0.1:5050/post")
      .then((response) => {
        this.setState({ posts: response.data.data.posts });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  postDeleteHandler = (id) => {
    axios
      .delete("http://127.0.0.1:5050/post/" + id, { withCredentials: true })
      .then((response) => {
        this.setState({
          posts: this.state.posts.filter((el) => el._id !== id),
        });
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addPostHandler = (post) => {
    const updatedPosts = this.state.posts;
    updatedPosts.unshift(post);
    this.setState({ posts: updatedPosts });
  };

  render() {
    let posts = [];

    this.state.posts.forEach((post) => {
      if (!post.blacklist) {
        let likes = 0,
          dislikes = 0,
          match = false,
          review;
        if (post.rxn) {
          post.rxn.forEach((el) => {
            if (
              !match &&
              this.context.authenticated &&
              JSON.stringify(el.user) ===
                JSON.stringify(this.context.currentUser._id)
            ) {
              match = true;
              review = el.review;
            }
            if (el.review === "upVote") likes++;
            else if (el.review === "downVote") dislikes++;
            else;
          });
        }
        const doc = (
          <Post
            key={post._id}
            author={post.author}
            content={post.content}
            id={post._id}
            date={post.createdAt}
            upVote={likes}
            downVote={dislikes}
            review={review}
          />
        );
        posts.push(doc);
      }
    });
    let myposts = (
      <div>
        <h2>Access Denied !</h2> <p>Please Login to get access</p>
      </div>
    );
    if (this.context.authenticated) {
      myposts = (
        <Mypost
          posts={this.state.posts}
          user={this.context.currentUser}
          delete={this.postDeleteHandler}
        />
      );
    }

    let addpost = <NewPost add={this.addPostHandler} />;

    return (
      <div className="Posts">
        <Route path="/post" exact render={() => posts} />
        <Route path="/addpost" exact render={() => addpost} />
        <Route path="/login" exact component={Login} />
        <Route path="/user/signup" exact component={SignUp} />
        <Route path="/forgotPassword" exact component={ForgotPass} />
        <Route path="/user/myPosts" exact render={() => myposts} />
        <Route path="/user" exact component={Users} />
        <Route path="/user/changePassword" exact component={ChangePass} />
        <Route path="/user/profile" exact component={Profile} />
      </div>
    );
  }
}

export default Blog;
