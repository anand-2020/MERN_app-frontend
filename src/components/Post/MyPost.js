import React from "react";
import Post from "./Post";
import "./Post.css";

const mypost = (props) => {
  let userpost = [];
  props.posts.forEach((post) => {
    if (post.author === props.user.username) {
      let likes = 0,
        dislikes = 0,
        match = false,
        review;
      if (post.rxn) {
        post.rxn.forEach((el) => {
          if (
            !match &&
            JSON.stringify(el.user) === JSON.stringify(props.user._id)
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
          blacklist={post.blacklist}
          delete={() => props.delete(post._id)}
        />
      );
      userpost.push(doc);
    }
  });
  if (userpost.length === 0) return <h3>You haven't made any posts</h3>;
  return userpost;
};

export default mypost;
