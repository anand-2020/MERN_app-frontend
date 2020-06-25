import React, { Component } from 'react';
import Header from './components/Header/Header';
import Blog from './containers/Blog/Blog';
import AuthContext from './context/auth-context';
import axios from 'axios';

class App extends Component {
  state = {
    isLoggedIn : false,
    currentUser : null
  }
   
  isLoginHandler = () => {
    
    axios.get('http://127.0.0.1:5050/user/isLoggedIn', {withCredentials:true})
         .then(response => {
             console.log(response);
             this.setState({isLoggedIn:true, currentUser:response.data.data.user});
         })
         .catch(error => {
             console.log(error);
         });
}

  componentDidMount () {
    this.isLoginHandler();
  };

  loginHandler = (user) => {
    if(!this.state.isLoggedIn) {this.setState({ isLoggedIn: true, currentUser:user }); }
    else {this.setState({ isLoggedIn: false, currentUser:null });}
  };
  

  render() {
    return (
      <AuthContext.Provider value={{
        authenticated:this.state.isLoggedIn,
      login:this.loginHandler,
      currentUser:this.state.currentUser}}>
      <div className="App">
        
        <div>
         <Header/>
        </div>
          <Blog/>
      </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
