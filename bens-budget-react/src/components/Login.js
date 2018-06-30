import React, {Component} from 'react';
//since we want to navigate to another controller
//after the person has logged in, we are going to use
//withrouter
import {withRouter} from 'react-router-dom';
import {API_URL} from '../Config';
//import the handleresponse helper
import {handleResponse} from '../Helper';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: "",
            loading: false,
            success: false
        }
        //bind so they can use the 'this' keyword
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    //deal with the changing of the email input
    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        //stop the redirect
        event.preventDefault();

        const {email, password} = this.state;
        console.log(email);
        if(email.length < 1 || password.length < 1) {
            return '';
        }
        //set loading to true
        //this.setState({loading: true});

        //now call our api to login
        fetch(`${API_URL}/users/login`,
        {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
        })
        //now handle the response
        .then(handleResponse)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
        
        
    }

    render() {
        const {email, password, loading, success} = this.state;

        return (
            <div className='container'>
                <form onSubmit={this.handleSubmit}>
                    <input
                    className='login-input'
                    type='text'
                    placeholder='Email'
                    name='email'
                    value={email}
                    onChange={this.handleEmailChange}/>
                    <input
                    className='login-input'
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={this.handlePasswordChange}/>
                    <button type='submit'>Login</button>
                </form>
            </div>
        );
    }
}

export default Login;