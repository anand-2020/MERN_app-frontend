import React, { Component } from "react";
import Button from "./../../components/UI/Button/Button";
import Spinner from "./../../components/UI/Spinner/Spinner";
import "./SignUp.css";
import axios from "axios";
import Input from "./../../components/UI/Input/Input";
import withErrorHandler from "./../../hoc/withErrorHandler";
import AuthContext from "./../../context/auth-context";
import Aux from "./../../hoc/auxilary";

class ChangePass extends Component {
  static contextType = AuthContext;
  state = {
    sumitted: false,
    form: {
      passwordCurrent: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Current Password",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "New Password",
          msg: "Password must be atleast 6 character long",
        },
        value: "",
        validation: {
          minLength: 6,
          required: true,
        },
        valid: false,
        touched: false,
      },
      confirmPassword: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Confirm new Password",
          msg: `Passwords don't match!`,
        },
        value: "",
        validation: {
          match: true,
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
    formIsValid: false,
    loading: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.form) {
      formData[formElementIdentifier] =
        this.state.form[formElementIdentifier].value;
    }
    const data = formData;
    axios
      .patch("http://127.0.0.1:5050/user/updateMyPassword/", data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (this.mounted) {
          this.setState({ loading: false, submitted: true });
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        if (this.mounted) {
          this.setState({ loading: false });
        }
      });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.isEmail) {
      const pattern =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.match) {
      isValid = value === this.state.form.password.value && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = {
      ...this.state.form,
    };
    const updatedFormElement = {
      ...updatedForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ form: updatedForm, formIsValid: formIsValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.form) {
      formElementsArray.push({
        id: key,
        config: this.state.form[key],
      });
    }
    let form = (
      <form onSubmit={this.submitHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          Set New Password
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    if (this.state.submitted) {
      form = <h3>Password changed successfully</h3>;
    }

    return (
      <Aux>
        {!this.context.authenticated ? (
          <h2>You are not logged in</h2>
        ) : (
          <div className="Contact">
            <h2>Change Password</h2>
            {form}
          </div>
        )}
      </Aux>
    );
  }
}

export default withErrorHandler(ChangePass, axios);
