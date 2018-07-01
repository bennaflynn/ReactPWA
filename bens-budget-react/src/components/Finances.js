import React, {Component} from 'react';

//functional imports
import {withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';

import {API_URL} from '../Config';
import {handleResponse} from '../Helper';

//this component manages the incomes and 
//the expenses of the person

class Finances extends Component {
    constructor(props) {
        super(props);

        const {cookies, history} = props;

        this.state = {
            //money going out
            expenses: [],
            //money going in
            incomes: [],
            //the difference
            balance: 0,
            //error handling,
            error: null
        };
    }
    
    componentWillMount() {
        const {cookies, history} = this.props;

        //if the email cookie doesn't exist then 
        //bounce back to the log in page
        if(!cookies.get('email')) {
            history.push('/');
        }
    }

    //when the component is mounted
    componentDidMount() {
        const {expenses, incomes, balance} = this.state;
        const {cookies} = this.props;

        //get the balances
        fetch(`${API_URL}/finances/balance`,
        {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email: cookies.get('email') || ""
        })
        })
        .then(handleResponse)
        .then((result) => {
            //now loop through our object and
            //add the results to the state
            var exp = expenses;
            var inc = incomes;
            var bal = balance;
            result.forEach(function(element) {
                 
                if(element.amount < 0) {
                    exp.push(element.amount);
                } else {
                    inc.push(element.amount);
                }
                bal += element.amount;
            }, this);
            this.setState({expenses: exp, incomes:inc, balance: bal});
            
        })
        .catch((error) => {
            console.log(error);
        })
        
        
    }

    incrementBalance(value) {
        var bal = this.state.balance;
        bal += value;
        this.setState({balance: bal});
    }
    decrementBalance(value) {
        var bal = this.state.balance;
        bal -= value;
        this.setState({balance: bal});
    }

    render() {
        const {expenses, incomes, balance, error} = this.state;

        //when I have error handling
        if(error) {
            return (
                <div className="error">{error}</div>
            );
        }

        return(
            <div className='container'>
                <h2>{balance}</h2>
                <button 
                className='btn-success'
                onClick={() => this.incrementBalance(100)}
                >$100</button>
                <button
                className='btn-danger'
                onClick={() => this.decrementBalance(100)}>$100</button>
            </div>
        );


    }
}

export default withRouter(withCookies(Finances));