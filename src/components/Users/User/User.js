import React, { Component } from "react";
import axios from "axios";
import AuthContext from "./../../../context/auth-context";
import "./User.css";
import icon from "./../../../asset/usericons.jpg";

class User extends Component {
  state = {
    role: this.props.role,
    blacklist: this.props.blacklist,
    changing: false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  blacklistHandler = () => {
    if (!this.state.changing) {
      const blacklist = !this.state.blacklist;
      const username = this.props.username;
      this.setState({ changing: true });
      axios
        .patch(
          "http://127.0.0.1:5050/user/" + this.props.id,
          { username, blacklist },
          { withCredentials: true }
        )
        .then((response) => {
          if (this.mounted) {
            this.setState({
              blacklist: response.data.data.user.blacklist,
              changing: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (this.mounted) {
            this.setState({ changing: false });
          }
          // window.alert('Access Denied!');
        });
    }
  };
  changeRoleHandler = () => {
    let role;
    if (this.state.role === "user") role = "admin";
    else role = "user";
    axios
      .patch(
        "http://127.0.0.1:5050/user/" + this.props.id,
        { role },
        { withCredentials: true }
      )
      .then((response) => {
        if (this.mounted) {
          this.setState({ role: response.data.data.user.role });
        }
      })
      .catch((error) => {
        console.log(error);
        // window.alert('Access Denied!');
      });
  };

  render() {
    var localDate = new Date(this.props.lastLogin);

    const ist = [
      localDate.getDate(),
      "-",
      localDate.getMonth(),
      "-",
      localDate.getFullYear(),
      "  ",
      localDate.getHours(),
      ":",
      localDate.getMinutes(),
    ];

    return (
      <div className="User">
        <img src={icon} alt="usericon" />
        <h1>{this.props.username}</h1>
        <h4>{this.state.role}</h4>
        <p>E-Mail : {this.props.email}</p>
        <p>Last Login : {ist} </p>
        <button
          className={
            this.state.blacklist ? "UserBlacklist UserButton" : "UserButton"
          }
          onClick={() => this.blacklistHandler()}
        >
          Blacklist
        </button>
        <button className="UserButton" onClick={() => this.changeRoleHandler()}>
          Change Role
        </button>
        <button className="UserButton" onClick={this.props.getPosts}>
          Posts
        </button>
      </div>
    );
  }
}

export default User;
