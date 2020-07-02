import React, { Component } from 'react';
import Button from './../../components/UI/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';
import './SignUp.css';
import axios from 'axios';
import Input from './../../components/UI/Input/Input';
import ResetPass from './ResetPass';
import withErrorHandler from './../../hoc/withErrorHandler';
import AuthContext from './../../context/auth-context';
import Aux from './../../hoc/auxilary';

class ForgotPass extends Component {
    static contextType=AuthContext;
      state = { reset:false,msg:'',
        form: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email', 
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
                }, 
              },
        formIsValid:false,
        loading: false
    }

    
    componentDidMount(){
        this.mounted=true;
    }

    componentWillUnmount(){
        this.mounted=false;
    }


    submitHandler = ( event ) => {
        if(event) event.preventDefault();
        this.setState( { loading: true, msg:'Sending OTP ...' } );
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        const data = formData;
        axios.post( 'http://127.0.0.1:5050/user/forgotPassword', data, {withCredentials:true} )
            .then( (response) => {
    
              if(this.mounted) { this.setState( { loading: false, reset:true, msg:'' } ); }
            } )
            .catch( error => {
                console.log(error.response.data);
              if(this.mounted) { this.setState( { loading: false, msg:''} ); }
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
    
    navigateBack = () =>{
        this.props.history.goBack();
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>Send OTP</Button>
                
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }
        
        return (
            <Aux>{this.context.authenticated?<h2>You are logged in</h2>:
            <div className="Contact">
             { this.state.reset?<div> <ResetPass email={this.state.form.email.value} resend={this.submitHandler}/> </div>:  
            <div>
                <h2>Reset Password</h2>
                <p>Enter your registered E-mail address to receive the OTP</p>
                {this.state.msg}
                {form}
                {!this.state.loading?<Button btnType="Danger" clicked={this.navigateBack}>Back</Button>:null}
            </div>}
            </div>}
            </Aux>
        );
    }
}

export default withErrorHandler(ForgotPass,axios);