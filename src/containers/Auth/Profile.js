import React, { Component } from "react";
import "./SignUp.css";
import AuthContext from "./../../context/auth-context";
import UpdateUser from "./UpdateUser";
import VerifyEmail from "./VerifyEmail";
import image from "./../../asset/userlogo.png";
import Aux from "./../../hoc/auxilary";

class Profile extends Component {
  static contextType = AuthContext;
  state = { changeEmail: false };

  emailHandler = (val) => {
    this.setState({ changeEmail: val });
  };

  render() {
    return (
      <Aux>
        {" "}
        {!this.context.authenticated ? (
          <h2>You are not logged in</h2>
        ) : (
          <div className="Profile">
            <div>
              <img src={image} alt="userlogo" className="Userlogo" />
            </div>
            <h2>
              {this.context.authenticated && this.context.currentUser.username}
            </h2>
            <p style={{ fontWeight: "bold" }}>
              E-mail :{" "}
              {this.context.authenticated && this.context.currentUser.email}
            </p>
            {this.state.changeEmail ? (
              <div>
                <UpdateUser set={() => this.emailHandler(false)} />
              </div>
            ) : (
              <div>
                <VerifyEmail />
                <button onClick={() => this.emailHandler(true)}>
                  Update E-mail
                </button>
              </div>
            )}
          </div>
        )}
      </Aux>
    );
  }
}

export default Profile;
