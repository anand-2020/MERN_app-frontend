import React,{Component} from 'react';
import axios from 'axios';
import AuthContext from './../../../context/auth-context'
import './User.css';
import button from '../../UI/Button/Button';

class User extends Component {
    state = {
        role:this.props.role, blacklist:this.props.blacklist
    }

    static contextType=AuthContext;

    blacklistHandler = () => {
        const blacklist = !this.state.blacklist;
        const username = this.props.username;
        axios.patch('http://127.0.0.1:5050/user/'+this.props.id, {username,blacklist}, {withCredentials:true})
             .then(response => {
                 this.setState({blacklist:response.data.data.user.blacklist});
                 console.log(response);
             })
             .catch(error => {
                 console.log(error);
                // window.alert('Access Denied!');
             });
    }
    changeRoleHandler = () => {
        let role;
        if(this.state.role==='user') role='admin';
        else role='user';
        axios.patch('http://127.0.0.1:5050/user/'+this.props.id, {role}, {withCredentials:true})
             .then(response => {
                 this.setState({role:response.data.data.user.role});
                 console.log(response);
             })
             .catch(error => {
                 console.log(error);
                // window.alert('Access Denied!');
             });
    }

    render () {

        return (
             <div>
                <h1>{this.props.username}</h1>
                <h4>{this.state.role}</h4>
                <button onClick={() =>this.blacklistHandler()}>BLACKLIST</button> 
                <button onClick={() =>this.changeRoleHandler()}>Change Role</button> 
                <button onClick={this.props.getPosts}>Posts</button>
             </div> 
        );
    }
}


export default User;

