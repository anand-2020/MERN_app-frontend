import React, { Component } from 'react';
import axios from 'axios';
import './Users.css';
import AuthContext from './../../../context/auth-context';
import Spinner from './../../UI/Spinner/Spinner';
import User from './../User/User';
import Post from './../../Post/Post';
import withErrorHandler from './../../../hoc/withErrorHandler';
import Aux from './../../../hoc/auxilary';

class Users extends Component {
    state = {
        users:[], posts:[], display:false, loading:true
    }

    static contextType=AuthContext;

    componentDidMount() {
           this.mounted=true;
        axios.get('http://127.0.0.1:5050/user',{withCredentials:true })
        .then(response => { 
           if(this.mounted) {this.setState({users:response.data.data.users, loading:false, });}
            })
           .catch(error => { console.log(error);  if(this.mounted) {this.setState({loading:false});} });
    }

    componentWillUnmount(){
        this.mounted=false;
    }
    getPostHandler = (name) => {
        axios.get('http://127.0.0.1:5050/user/posts/'+name, {withCredentials:true})
        .then(response => {
            if(this.mounted){ this.setState({posts:response.data.data.posts, display:true}); }                   console.log(response);})
        .catch(error => {console.log(error); });           
    }

    changeDisplay = () => {
        this.setState({display:false, posts:[]});
    }

    render () {
        const allUsers=this.state.users.map(user => {
            return <User key={user._id}  username={user.username} role={user.role} id={user._id} blacklist={user.blacklist}
                  email={user.email} lastLogin={user.lastLogin} getPosts={() => this.getPostHandler(user.username)}
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
            return <Post key={post._id} author={post.author} content={post.content} id={post._id} date={post.createdAt}
                                    upVote={likes} downVote={dislikes} review={review} 
                                    blacklist={post.blacklist} blacklistAllowed={true}/>;
        });                            

        return (
            <Aux>{
                (!this.context.authenticated ||(this.context.authenticated && this.context.currentUser.role!=='admin'))?
                <h2>Access Denied</h2>:
            <div className="Users">
            {this.state.display? <div className="Posts"><button className="Cloj" onClick={this.changeDisplay}>Close</button>{userPosts} </div>:
                 <div >
                     <h2 style={{textAlign:'center'}}>PostPlay Users</h2>
                 {allUsers}
                 </div>}
            {this.state.loading?<Spinner/>:null}   
            </div>}
            </Aux>
        );
    }
}


export default withErrorHandler( Users,axios);