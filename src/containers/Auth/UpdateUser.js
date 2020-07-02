import React, { Component } from 'react';
import Button from './../../components/UI/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';
import './SignUp.css';
import axios from 'axios';
import Input from './../../components/UI/Input/Input';
import AuthContext from './../../context/auth-context';
import withErrorHandler from './../../hoc/withErrorHandler';

class UpdateUser extends Component {
    static contextType=AuthContext;
      state = { 
        form:{ 
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'New email',
                    msg:`Enter a valid email`
                },
                value: '',
                validation: {
                    required: true,
                    isEmail:true
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
        this.setState( { loading: true } );
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        const data = formData;
        axios.patch( 'http://127.0.0.1:5050/user/updateMe/', data, {withCredentials:true} )
            .then( response => {
                if(this.mounted){
                this.context.login(response.data.data.user); 
                this.setState( { loading: false } );
                this.props.set();
                this.props.history.push( '/user/profile' );
                }
            } )
            .catch( error => {
                console.log(error);
              if(this.mounted) { this.setState( { loading: false } ); }
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>Set New Email</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }
        
        return (
            <div>
                {form}
            </div>
        );
    }
}

export default withErrorHandler( UpdateUser, axios);
