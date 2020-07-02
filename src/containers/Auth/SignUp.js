import React, { Component } from 'react';
import AuthContext from './../../context/auth-context';
import Button from './../../components/UI/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';
import './SignUp.css';
import axios from 'axios';
import Input from './../../components/UI/Input/Input';
import withErrorHandler from './../../hoc/withErrorHandler';
import Aux from './../../hoc/auxilary';

class SignUp extends Component {
    static contextType=AuthContext;
    state = {
        form: {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username',
                    msg:'Username must be at least 3 character long',
                },
                value: '',
                validation: {
                    minLength:3,
                    required: true
                },
                
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-Mail',
                    msg:'Enter a valid email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                    msg:'Password must be at least 6 character long'
                },
                value: '',
                validation: {
                    minLength:6,
                    required: true
                },
                valid: false,
                touched: false
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Confirm Password',
                    msg:`Passwords don't match!`
                },
                value: '',
                validation: {
                    match:true,
                    required: true
                },
                valid: false,
                touched: false
            },
        },
        formIsValid: false,
        loading: false
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        const data = formData;
        axios.post( 'http://127.0.0.1:5050/user/signup', data, {withCredentials:true} )
            .then( response => {
                this.context.login(response.data.data.user);
                this.setState( { loading: false } );
                this.props.history.push( '/post' ); 
            } )
            .catch( error => {
                console.log(error.response.data);
                this.setState( { loading: false } );
            } );
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
        
        if(rules.match) {
            isValid = (value === this.state.form.password.value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedForm = {
            ...this.state.form
        };
        const updatedFormElement = { 
            ...updatedForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({form: updatedForm, formIsValid: formIsValid});
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.form) {
            formElementsArray.push({
                id: key,
                config: this.state.form[key]
            });
        }
        let form = (
            <form onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>SIGN UP</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />; 
        }
        return (
            <Aux>{this.context.authenticated?<h2>You are logged in</h2>:          
            <div className="Contact">
                <h4>Create a new Account</h4>
                {form}
            </div>}
            </Aux>
        );
    }
}

export default withErrorHandler(SignUp,axios);