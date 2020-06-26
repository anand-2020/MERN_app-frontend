import React, {Component} from 'react';
import axios from 'axios';
import './Post.css';

class Post extends Component { 
    state ={
        like:false, dislike:false, upVote:this.props.upVote, downVote:this.props.downVote, blacklist:this.props.blacklist
    }

    componentDidMount() {
        if(this.props.review==='upVote') this.setState({like:true });
        else if(this.props.review === 'downVote') this.setState({dislike:true});
        else ;
    }

     reactionHandler = (rxn)  => {
         const id = this.props.id;
         if(!this.state.like && !this.state.dislike)
         {
             axios.post(`http://127.0.0.1:5050/post/review/${id}`, {review:rxn}, {withCredentials:true})
             .then(res => { rxn==='upVote'? this.setState({like:true, upVote:this.state.upVote+1}):this.setState({dislike:true, downVote:this.state.downVote+1})
                          console.log(res);})
             .catch(err => {console.log(err.response.data);});
         }   
         else if(this.state.like)
         {
             if(rxn==='upVote') {
                axios.delete(`http://127.0.0.1:5050/post/review/${id}`,{withCredentials:true})
                .then(res => {this.setState({like:false, upVote:this.state.upVote - 1});
                           console.log(res);})
                .catch(err => {console.log(err.response.data);});
             }
             else{
                axios.patch(`http://127.0.0.1:5050/post/review/${id}`, {review:rxn}, {withCredentials:true})
                .then(res => {this.setState({like:false, dislike:true, 
                              upVote:this.state.upVote-1, downVote:this.state.downVote+1});
                        console.log(res);})
                .catch(err => {console.log(err);});
             }
         }
         else {
            if(rxn==='downVote') {
                axios.delete(`http://127.0.0.1:5050/post/review/${id}`,{withCredentials:true})
                .then(res => {this.setState({dislike:false, downVote:this.state.downVote-1});
                    console.log(res);})
                .catch(err => {console.log(err.response.data);});
             }
             else{
                axios.patch(`http://127.0.0.1:5050/post/review/${id}`, {review:rxn}, {withCredentials:true})
                .then(res => {this.setState({dislike:false, like:true, 
                    upVote:this.state.upVote+1, downVote:this.state.downVote-1});
                    console.log(res);})
                .catch(err => {console.log(err.response.data);});
             }
         }
    }

    blacklistHandler = () => {
        const blacklist = !this.state.blacklist;
        axios.patch(`http://127.0.0.1:5050/post/${this.props.id}`, {blacklist:blacklist}, {withCredentials:true})
        .then( res => {
            this.setState({blacklist:res.data.data.post.blacklist}); 
            console.log(res);})
        .catch(err => {console.log(err.response.data);});    
    }

    render(){
    return(
    <article className="Post">
        <h1>{this.props.content}</h1>
        <div className="Info">
        <div className="Author">{this.props.author}</div>
        <button onClick={() => this.reactionHandler('upVote')} >LIKE</button>  <p>{this.state.upVote} </p>
        <button onClick={() => this.reactionHandler('downVote')} >DISLIKE</button>  <p>{this.state.downVote} </p>
         {this.props.review? <p>{this.props.review}</p>:null}
        </div>
      {this.props.delete? <button onClick={this.props.delete} >DELETE</button>:null}
      {this.props.blacklistAllowed? <button onClick={this.blacklistHandler}>BLACKLIST</button>:null}
    </article>
   );
 }
}

export default Post;