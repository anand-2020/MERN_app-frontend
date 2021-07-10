import React, { Component } from "react";
import Button from "./../../components/UI/Button/Button";
import Spinner from "./../../components/UI/Spinner/Spinner";
import "./SignUp.css";
import axios from "axios";
import Input from "./../../components/UI/Input/Input";
import withErrorHandler from "./../../hoc/withErrorHandler";
import AuthContext from "./../../context/auth-context";

class ResetPass extends Component {
  static contextType = AuthContext;
  state = {
    form: {
      token: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "OTP",
        },
        value: "",
        validation: {
          isNumeric: true,
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
          placeholder: "Confirm New Password",
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
      .patch(
        "http://127.0.0.1:5050/user/resetPassword/" + this.props.email,
        data,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (this.mounted) {
          this.setState({ loading: false });
        }
        this.context.login(response.data.data.user);
        this.props.history.push("/post");
      })
      .catch((error) => {
        console.log(error);
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

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
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
          LOGIN
        </Button>
      </form>
    );

    return (
      <div>
        {!this.state.loading ? (
          <div>
            <p>
              Enter the OTP sent to your registered e-mail address and Reset
              your Password
            </p>
            {form}
            <button className="Resend" onClick={this.props.resend}>
              Resend OTP
            </button>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default withErrorHandler(ResetPass, axios);
