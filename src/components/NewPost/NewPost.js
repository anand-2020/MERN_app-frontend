import React, { Component } from 'react';
import axios from 'axios';
import './NewPost.css';
import AuthContext from './../../context/auth-context';
import {Redirect} from 'react-router-dom';
import Spinner from './../UI/Spinner/Spinner';
import withErrorHandler from './../../hoc/withErrorHandler';

class NewPost extends Component {
    state = {
        content:undefined,
        submitted:false,
        loading:false
    }

    static contextType=AuthContext;

    componentDidMount(){
        this.mounted=true;
    }

    componentWillUnmount(){
        this.mounted=false;
    }

    addPostHandler = () => {
        const data = {
            content:this.state.content
        }
        this.setState({loading:true});
        axios.post('http://127.0.0.1:5050/post', data, {withCredentials:true})
             .then(response => {
                if(this.mounted) {this.props.add(response.data.data.post);
                 this.setState({submitted: true, loading:false}); }
             })
             .catch(error => {
                 console.log(error);
              if(this.mounted) { this.setState({loading:false}); } 
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
       let body =  
                   !this.state.loading?
                    <div>
                    {redirect}   
                    <h1>Add a Post</h1>
                    <label>Content</label>
                   <textarea rows="10" value={this.state.content} onChange={(event) => this.setState({content: event.target.value})} />
                    <button onClick={this.addPostHandler}>Add Now</button>
                  </div>:<Spinner/>
        
    if(!this.context.authenticated){ body=<div>
                                           <h2>Access Denied!</h2> 
                                           <p> Please login to add a post.</p>
                                           </div> }
        if(this.context.authenticated && !this.context.currentUser.emailIsVerified)
             { body=<div>
                       <h2>Access Denied!</h2> 
                       <p>Your E-Mail is not verified. You can't add posts !</p>
                       <p>Go to Profile section and then verify your E-Mail</p>
                    </div>  }    
         if(this.context.authenticated && this.context.currentUser.blacklist)
         { body=<div>
                   <h2>Access Denied!</h2> 
                   <p>You are Blacklisted. You can't add posts !</p>
                </div>  }                              
        return (
            <div className="Add">
             {body}
            </div> 
        );
    }
}


export default withErrorHandler(NewPost,axios);