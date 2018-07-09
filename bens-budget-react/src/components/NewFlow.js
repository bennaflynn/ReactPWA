import React, {Component} from 'react';

//functional imports
import {API_URL} from '../Config';
import {withRouter} from 'react-router-dom';
import {Cookies, withCookies} from 'react-cookie';
import {handleResponse} from '../Helper';
import {checkCookie} from '../CheckCookie';

import './NewFlow.css';

//this component allows the user to either enter
//an inflow or an outflow of income. Here is where 
//they can specify whether it is a monthly flow or
//not, and also add more information like the name
//of the flow

class NewFlow extends Component {
    constructor(props) {
        super(props);
        const {cookie, history} = this.props;

        this.state = {
            name: '',
            amount: 0,
            isIncome: true,
            isMonthly: true,
            flowType: 'income',
            epoch: 'monthly'
        }

        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleExpenseOptionChange = this.handleExpenseOptionChange.bind(this);
        this.handleMonthlyOptionChange = this.handleMonthlyOptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const {history, cookies} = this.props;
        checkCookie()

        
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    };
    handleAmountChange(event) {
        this.setState({amount: event.target.value});
        console.log("Is Monthly: " + this.state.isMonthly);
    };
    handleExpenseOptionChange(event) {
        this.setState({
            flowType: event.target.value,
            isIncome: event.target.value === 'income' ? true : false
        })     
    };
    handleMonthlyOptionChange(event) {
        this.setState({
            epoch: event.target.value,
            isMonthly: event.target.value === 'monthly' ? true : false
        });
    };
    handleSubmit(event) {
        //don't navigate away you silly goose
        event.preventDefault();
        
        var {name, amount, isIncome, isMonthly} = this.state;
        const {cookies, history} = this.props;
        //get the users email
        var email = cookies.get('email') || '';

        
        console.log("Income: " + isIncome);
        console.log("Monthly: " + isMonthly);
        

        fetch(`${API_URL}/finances/newflow`,
        {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email: email,
            amount: isIncome ? amount : amount * -1,
            name: name || '',
            monthly: isMonthly
        })
        })
        .then(handleResponse)
        .then((result) => {
            if(result.success) {
                alert('Success');
            } else {
                alert('Was not added');
            }
            history.push('/finances');
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        var {name, amount, isIncome, isMonthly, flowType, epoch} = this.state;
        
        return(
            <div className=''>
                <form className='form-group' onSubmit={this.handleSubmit}>
                    <input 
                    className='form-control'
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={this.handleNameChange}/>
                    <input 
                    className='form-control'
                    type='number'
                    min='1'
                    placeholder='Amount'                   
                    onChange={this.handleAmountChange}/>
                    
                    <div className="radio">
                        <label>
                            <input 
                            type="radio"
                            value='income'
                            checked={flowType === 'income'}
                            onChange={this.handleExpenseOptionChange}/>
                            Income
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input 
                            type="radio"
                            value='expense'
                            checked={flowType === 'expense'}
                            onChange={this.handleExpenseOptionChange}/>
                            Expense
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input 
                            type="radio"
                            value='monthly'
                            checked={epoch === 'monthly'}
                            onChange={this.handleMonthlyOptionChange}/>
                            Monthly
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input 
                            type="radio"
                            value='not'
                            checked={epoch === 'not'}
                            onChange={this.handleMonthlyOptionChange}/>
                            One Time
                        </label>
                    </div>
                    <button type='submit'>Add New Flow</button>
                </form>
            </div>
        );
    }
}

export default withRouter(withCookies(NewFlow));