import React, { Component } from "react";
import Header from "./components/Header/Header";
import Blog from "./containers/Blog/Blog";
import AuthContext from "./context/auth-context";
import axios from "axios";
import Spinner from "./components/UI/Spinner/Spinner";
import ErrorBoundary from "./containers/ErrorBoundary/ErrorBoundary";

class App extends Component {
  state = {
    isLoggedIn: false,
    currentUser: null,
    loading: true,
  };

  isLoginHandler = () => {
    axios
      .get("http://127.0.0.1:5050/user/isLoggedIn", { withCredentials: true })
      .then((response) => {
        this.setState({
          isLoggedIn: true,
          currentUser: response.data.data.user,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };
  componentDidMount() {
    this.isLoginHandler();
  }

  loginHandler = (user) => {
    if (user) {
      this.setState({ isLoggedIn: true, currentUser: user });
    } else {
      this.setState({ isLoggedIn: false, currentUser: null });
    }
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          authenticated: this.state.isLoggedIn,
          login: this.loginHandler,
          currentUser: this.state.currentUser,
        }}
      >
        {!this.state.loading ? (
          <div className="App">
            <div>
              <Header />
            </div>
            <ErrorBoundary>
              <Blog />
            </ErrorBoundary>
          </div>
        ) : (
          <Spinner />
        )}
      </AuthContext.Provider>
    );
  }
}

export default App;
