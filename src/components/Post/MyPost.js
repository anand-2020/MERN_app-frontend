import React from 'react';

import './Post.css';

const mypost = (props) => (
    <article className="Post" >
        <h1>{props.content}</h1>
        <div className={props.blacklist?"Blacklist":null}>
        <div className="Author">{props.author}</div>
        </div>
        <button onClick={props.delete}>DELETE</button>
    </article>
);

export default mypost;