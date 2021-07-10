import React, { Component } from 'react';
import Button from './../../components/UI/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';
import './SignUp.css';
import axios from 'axios';
import Input from './../../components/UI/Input/Input';
import AuthContext from '../../context/auth-context';
import withErrorHandler from './../../hoc/withErrorHandler';

class VerifyEmail extends Component {
    static contextType=AuthContext;
      state = { send:false, msg:'', disable:false, 
        form:{ 
            token: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'OTP',
                },
                value: '',
                validation: {
                    isNumeric:true,
                    required: true
                },
                valid: false,
                touched: false
            }
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
        event.preventDefault();
        this.setState( { loading: true , disable:true} );
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        const data = formData;
        axios.post( 'http://127.0.0.1:5050/user/verifyEmail/', data, {withCredentials:true} )
            .then( response => { console.log(response);
                if(this.mounted){
                this.context.login(response.data.data.user);
                this.setState( { loading: false, disable:false , } );
            } })
            .catch( error => {
                console.log(error);
                if(this.mounted){this.setState( { loading: false , disable:false} );}
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
        
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
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
    
    sendOTPHandler = () => {
        this.setState({loading:true, msg:'Sending OTP ...',disable:true});
        axios.get( 'http://127.0.0.1:5050/user/verifyEmail/', {withCredentials:true} )
        .then( response => {
        
           if(this.mounted){ this.setState( {  send:true, loading:false, msg:'', disable:false} ); }
        } )
        .catch( error => {
            console.log(error.response.data);
          if(this.mounted){  this.setState( { loading: false, msg:'',disable:false } ); }
        } );
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>VERIFY</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }

        
        return (
            <div>
                <p>{this.state.msg}</p>
                {this.context.authenticated && this.context.currentUser.emailIsVerified?<p>Your email is verified. You can add posts.</p>:
                <div>{ this.state.send?
                <div>
                    <p>Enter the OTP sent to your registered E-Mail</p>
                {form}
                <button className="Resend" onClick={this.sendOTPHandler} disabled={this.state.disable}>Resend OTP</button>
                </div>:<button onClick={this.sendOTPHandler}>Verify E-mail</button>}</div>}
            </div>
        );
    }
}

export default withErrorHandler( VerifyEmail,axios);