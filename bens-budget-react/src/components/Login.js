import React, {Component} from 'react';
import {instanceOf} from 'prop-types';
//since we want to navigate to another controller
//after the person has logged in, we are going to use
//withrouter
import {withRouter} from 'react-router-dom';
import {API_URL} from '../Config';
//import the handleresponse helper
import {handleResponse} from '../Helper';
//cookies
import {withCookies, Cookies} from 'react-cookie';

class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies)
    };

    constructor(props) {
        super(props);

        //add the with router props to props
        const {cookies, history} = props;

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

    componentWillMount() {
        const {cookies,history} = this.props;
        
        //if the cookie is already set, then they are
        //already logged in
        if(cookies.get('email')) {
            history.push('/finances');
        }
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
        const {cookies, history} = this.props;

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
            //success
            //the object sent back has the token
            //but since JWT isn't doing it for me
            //right now we are just gonna lock the 
            //email as a cookie
            cookies.set('email', email, {path: '/'} );
            console.log(result);

            //now bounce to our main finances page
            history.push('/finances');
        })
        .catch((error) => {
            console.log(error);
        })
        
        
    }

    render() {
        const {email, password, loading, success} = this.state;
        const {cookies} = this.props;

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
                    <button className='btn-primary' type='submit'>Login</button>
                </form>
            </div>
        );
    }
}

export default withRouter(withCookies(Login));