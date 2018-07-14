import React, {Component} from 'react';

//functional imports
import {withRouter} from 'react-router-dom';
import {API_URL} from '../Config';
import {handleResponse} from '../Helper';
import {Cookies, withCookies} from 'react-cookie';
//functional style imports
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

class NewUser extends Component {
    constructor(props) {
        super(props);

        const {history, cookies} = this.props;

        this.state = {
            email: '',
            pass1: '',
            pass2: '',
            error: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //handleChange
    handleChange(e) {
        //console.log(e.target.name);

        switch(e.target.name) {
            case 'email': 
                this.setState({email: e.target.value, error: ''})
                break;
            case 'pass1':
                this.setState({pass1: e.target.value, error: ''})
                break;
            case 'pass2':
                this.setState({pass2: e.target.value, error: ''});
                break;
            default:
                break;
        }
    }

    handleSubmit(e) {
        //stop the navigation to another page
        e.preventDefault();

        const {email, pass1, pass2, error} = this.state;
        const {history, cookies} = this.props;

        if(!email || !pass1 || !pass2) {
            this.setState({error: "Please fill out all the fields"});
            console.log('Locally empty fields')
            return;
        }
        if(pass1 != pass2) {
            console.log('Locally passwords don\'t match');
            this.setState({error: "Passwords must match"});
            return;
        }
        
        //creating the new user
        fetch(`${API_URL}/users/newuser`,
            {method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
             },
             body: JSON.stringify({
                email: email,
                password: pass1,
                password2: pass2
             })
            })
        .then(handleResponse)
        .then((result) => {
            if(result.success == false) {
                this.setState({error: result.message, pass1: '', pass2: ''});
            } else {
                this.setState({email: '', pass1: '', pass2: ''});
                cookies.set('token', result.token, {path: '/'} );
                history.push('/finances');
            }
            //console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })

    }

    render() {
        const {error} = this.state;
        return(
            <form
            onSubmit={this.handleSubmit}>
                <FormGroup
                //controlId='newUserForm'
                >
                    <ControlLabel>Add a new Account</ControlLabel>
                    <FormControl

                        type='text'
                        value={this.state.email}
                        placeholder='Username'
                        onChange={this.handleChange}
                        name='email'
                    />
                    
                    <FormControl
                        type='password'
                        value={this.state.pass1}
                        placeholder='Password'
                        onChange={this.handleChange}
                        name='pass1'
                    />
                    
                    <FormControl
                        type='password'
                        value={this.state.pass2}
                        placeholder='Confirm Password'
                        onChange={this.handleChange}
                        name='pass2'
                    />

                    <button type='submit'>Add new user</button>
                </FormGroup>
                <p>{error}</p>
            </form>
        );
    }
}

export default withRouter(withCookies(NewUser));