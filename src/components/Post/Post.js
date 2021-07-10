import React, {Component} from 'react';
import axios from 'axios';
import './Post.css';
import withErrorHandler from './../../hoc/withErrorHandler';
import AuthContext from './../../context/auth-context';

class Post extends Component { 
    state ={
        like:false, dislike:false, upVote:this.props.upVote, downVote:this.props.downVote, blacklist:this.props.blacklist,
        load:false
    }
    static contextType=AuthContext;
    componentDidMount() {
        if(this.props.review==='upVote') this.setState({like:true });
        else if(this.props.review === 'downVote') this.setState({dislike:true});
        else ;
    }
     
     reactionHandler = (rxn)  => {
        const id = this.props.id;
         if(!this.state.load){
                   this.setState({load:true});
         if(!this.state.like && !this.state.dislike)
         {   
             axios.post(`http://127.0.0.1:5050/post/review/${id}`, {review:rxn}, {withCredentials:true})
             .then(res => { rxn==='upVote'? this.setState((prevState) =>{return {like:true, upVote:prevState.upVote+1, load:false};}):
                                         this.setState((prevState) => { return {dislike:true, downVote:prevState.downVote+1, load:false};})
                         console.log(res); })
             .catch(err => {this.setState({load:false}); console.log(err.response.data);});
         }   
         else if(this.state.like)
         {
             
             if(rxn==='upVote') {
                axios.delete(`http://127.0.0.1:5050/post/review/${id}`,{withCredentials:true})
                .then(res => {this.setState((prevState, props) => { return{like:false, upVote:prevState.upVote - 1, load:false}; });
                         console.log(res);  })
                .catch(err => {this.setState({load:false}); console.log(err.response.data);});
             }
             else{
                axios.patch(`http://127.0.0.1:5050/post/review/${id}`, {review:rxn}, {withCredentials:true})
                .then(res => {this.setState((prevState,props) => { return{like:false, dislike:true, load:false,
                              upVote:prevState.upVote-1, downVote:prevState.downVote+1}; });
                     console.log(res);   })
                .catch(err => {this.setState({load:false}); console.log(err);});
             }
         }
         else {
            if(rxn==='downVote') {
                axios.delete(`http://127.0.0.1:5050/post/review/${id}`,{withCredentials:true})
                .then(res => {this.setState((prevState, props) => { return{dislike:false, downVote:prevState.downVote-1,
                                                                      load:false}; });
                 console.log(res);   })
                .catch(err => {this.setState({load:false}); console.log(err.response.data);});
             }
             else{
                axios.patch(`http://127.0.0.1:5050/post/review/${id}`, {review:rxn}, {withCredentials:true})
                .then(res => {this.setState((prevState, props) => {return {dislike:false, like:true, load:false,
                    upVote:prevState.upVote+1, downVote:prevState.downVote-1}; });
                  console.log(res);  })
                .catch(err => {this.setState({load:false}); console.log(err.response.data);});
             }
         }
        }
    }

    blacklistHandler = () => {
        const blacklist = !this.state.blacklist;
        axios.patch(`http://127.0.0.1:5050/post/${this.props.id}`, {blacklist:blacklist}, {withCredentials:true})
        .then( res => {
            this.setState({blacklist:res.data.data.post.blacklist}); 
            })
        .catch(err => {console.log(err.response.data);});    
    }
 

    render(){
        var localDate = new Date(this.props.date) ;
        
        const ist=[localDate.getDate(),"-", localDate.getMonth(),"-", localDate.getFullYear(),"  ", localDate.getHours(),":", localDate.getMinutes()];
    return(
    <article className={this.state.blacklist?"Post Blacklist":"Post"}>
         <span className="Author">{this.props.author}</span>  
         <div className="Date">{ist}</div>
         <hr/>
        <p className="Content">{this.props.content}</p>
        <div className="React">
        <button className={this.state.like?"Like Active":"Like"} disabled={!this.context.authenticated || (this.context.authenticated && !this.context.currentUser.emailIsVerified)} onClick={() => this.reactionHandler('upVote')} >upVote</button>  {this.state.upVote } <span className="Space">|</span>
        <button className={this.state.dislike?"Dislike Active":"Dislike"} disabled={!this.context.authenticated ||  (this.context.authenticated && !this.context.currentUser.emailIsVerified)} onClick={() => this.reactionHandler('downVote')} >downVote</button>  {this.state.downVote} 
        </div>   
      {this.props.delete? <button className="DndBButton" onClick={this.props.delete} >DELETE</button>:null}
      {this.props.blacklistAllowed? <button className="DndBButton" onClick={this.blacklistHandler}>BLACKLIST</button>:null}
    </article>
   );
 }
}

export default withErrorHandler(Post,axios);